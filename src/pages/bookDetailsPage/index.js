import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Card, Container, Grid, Link, Stack, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import {
  authorPhotoUrl,
  coverUrl,
  getAuthor,
  getBook,
  getBookRatings,
  getBookSummary,
  textValue,
  workId,
} from '../../api/bookAPI';
import { addBookToList, getMovieListById, getMovieListsByUserId } from '../../api/movieStorage';
import { auth } from '../../firebase-config';
import { AlertContext } from '../../contexts/alertContext';
import { toListEntry } from '../../listTransfer';
import {
  AddToListSelect,
  DetailHero,
  DetailHeroSkeleton,
  ExpandableText,
  ExternalLinks,
  FactGrid,
  Section,
} from '../../components/detail';

// Open Library descriptions often carry markdown links, reference lists and "----" footers
const cleanDescription = (text) =>
  textValue(text)
    .split(/\n-{3,}/)[0]
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\[\d+\]/g, '$1')
    .replace(/^\s*\[\d+\]:.*$/gm, '')
    .replace(/\(\[source\]\)/gi, '')
    .trim();

// Subjects are noisy (e.g. "nyt:hardcover-fiction=2008-01-01"); keep short, readable ones
const readableSubjects = (subjects = []) =>
  subjects.filter((s) => s && s.length <= 28 && !/[:=]/.test(s)).slice(0, 6);

const AuthorCard = ({ author }) => {
  const photo = authorPhotoUrl(author.photos?.[0]);
  const dates = [author.birth_date, author.death_date].filter(Boolean).join(' – ');
  const bio = cleanDescription(author.bio);
  return (
    <Card sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: bio ? 2 : 0 }}>
        <Avatar src={photo || undefined} alt={author.name} sx={{ width: 64, height: 64 }}>
          {author.name?.charAt(0)}
        </Avatar>
        <Box>
          <Link href={`https://openlibrary.org/authors/${workId(author.key)}`} target="_blank" rel="noopener noreferrer" color="text.primary" fontWeight={700} variant="h6">
            {author.name}
          </Link>
          {dates && <Typography variant="body2" color="text.secondary">{dates}</Typography>}
        </Box>
      </Stack>
      {bio && <ExpandableText text={bio} lines={4} threshold={400} />}
    </Card>
  );
};

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addAlert } = React.useContext(AlertContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);

  useEffect(() => onAuthStateChanged(auth, (authUser) => setUser(authUser || null)), []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const work = await getBook(id);
        // Summary/ratings are nice-to-have; don't fail the page if they're unavailable
        const [summary, ratings] = await Promise.all([
          getBookSummary(work.key).catch(() => null),
          getBookRatings(work.key).catch(() => null),
        ]);
        const authorKeys = (work.authors || []).map((a) => a.author?.key).filter(Boolean).slice(0, 4);
        const authors = (await Promise.all(authorKeys.map((key) => getAuthor(key).catch(() => null)))).filter(Boolean);
        if (!active) return;
        setBook({
          id: workId(work.key),
          key: work.key,
          title: work.title,
          description: cleanDescription(work.description),
          cover_i: work.covers?.find((c) => c > 0) || summary?.cover_i || null,
          subjects: work.subjects || summary?.subject || [],
          authorRecords: authors,
          authors: authors.length ? authors.map((a) => a.name) : summary?.author_name || [],
          author_keys: authors.map((a) => workId(a.key)),
          first_publish_year: summary?.first_publish_year || (work.first_publish_date ? parseInt(work.first_publish_date.match(/\d{4}/)?.[0], 10) : null),
          number_of_pages_median: summary?.number_of_pages_median || null,
          edition_count: summary?.edition_count || null,
          ebook_access: summary?.ebook_access || null,
          ratings_average: ratings?.summary?.average || summary?.ratings_average || null,
          ratings_count: ratings?.summary?.count || summary?.ratings_count || null,
        });
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        if (active) navigate('/404', { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!user) return;
    getMovieListsByUserId(user.uid)
      .then((all) => setLists(all.filter((list) => (list.users?.find((u) => u.uid === user.uid)?.accessType || 0) > 0)))
      .catch(console.error);
  }, [user]);

  const handleAddToList = async (event) => {
    const listId = event.target.value;
    if (!listId || !user) return;
    try {
      const list = await getMovieListById(listId);
      if ((list.books || []).find((b) => b.id === book.id)) throw new Error(`Book is already in "${list.title}"`);
      const entry = { ...toListEntry(book, 'book'), watched: 0, addedDate: new Date().toISOString(), addedBy: user.uid };
      await addBookToList(listId, entry);
      addAlert('success', `${book.title} added to ${list.title}`);
    } catch (error) {
      addAlert('error', error.message);
    }
  };

  if (loading || !book) return <DetailHeroSkeleton />;

  const readable = book.ebook_access === 'public' || book.ebook_access === 'borrowable';

  return (
    <>
      <DetailHero
        posterSrc={coverUrl(book.cover_i, 'L')}
        title={book.title}
        rating={book.ratings_average}
        ratingScale={5}
        voteCount={book.ratings_count}
        meta={[
          book.authors.length ? `by ${book.authors.join(', ')}` : null,
          book.first_publish_year,
          book.number_of_pages_median ? `${book.number_of_pages_median} pages` : null,
        ]}
        chips={readableSubjects(book.subjects)}
        overview={book.description ? <ExpandableText text={book.description} lines={5} threshold={450} /> : null}
        actions={
          <>
            <AddToListSelect lists={lists} onSelect={handleAddToList} />
            <ExternalLinks
              links={[
                { label: readable ? (book.ebook_access === 'public' ? 'Read free' : 'Borrow') : 'Open Library', href: `https://openlibrary.org/works/${book.id}` },
                { label: 'Goodreads', href: `https://www.goodreads.com/search?q=${encodeURIComponent(`${book.title} ${book.authors[0] || ''}`.trim())}` },
              ]}
            />
          </>
        }
      />
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Section title="Details">
          <FactGrid
            facts={[
              { label: 'First published', value: book.first_publish_year },
              { label: 'Pages', value: book.number_of_pages_median },
              { label: 'Editions', value: book.edition_count },
              { label: 'Ratings', value: book.ratings_count ? book.ratings_count.toLocaleString() : null },
              { label: 'Online', value: book.ebook_access === 'public' ? 'Free to read' : book.ebook_access === 'borrowable' ? 'Borrowable' : null },
            ]}
          />
        </Section>

        {book.authorRecords.length > 0 && (
          <Section title={book.authorRecords.length > 1 ? 'About the authors' : 'About the author'}>
            <Grid container spacing={2}>
              {book.authorRecords.map((author) => (
                <Grid item xs={12} md={book.authorRecords.length > 1 ? 6 : 12} key={author.key}>
                  <AuthorCard author={author} />
                </Grid>
              ))}
            </Grid>
          </Section>
        )}

        {book.subjects.length > 0 && (
          <Section title="Subjects">
            <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 2 }}>
              {book.subjects.slice(0, 30).join(' · ')}
            </Typography>
          </Section>
        )}

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 6 }}>
          Book data from <Link href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" color="inherit">Open Library</Link>.
        </Typography>
      </Container>
    </>
  );
};

export default BookDetailsPage;
