import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { getMovie, getMovieCredits, getMovieImages, getMovieVideos, getMovieRecommendations, getMovieReviews, getMovieWatchProviders } from '../../api/TMDBAPI';
import { getMovieListById, addMovieToList, getMovieListsByUserId } from '../../api/movieStorage';
import { auth } from '../../firebase-config';
import { AlertContext } from '../../contexts/alertContext';
import { SiteDataContext } from '../../contexts/siteDataContext';
import MediaDisplay from '../../components/mediaDisplay';
import MovieCard from '../../components/MovieComponents/movieCard';
import WhereToWatch from '../../components/whereToWatch';
import { filterAdult } from '../../utils';
import {
  AdultContentNotice,
  AddToListSelect,
  DetailHero,
  DetailHeroSkeleton,
  ExternalLinks,
  FactGrid,
  PeopleGrid,
  ReviewList,
  Section,
  mergeCrew,
} from '../../components/detail';

const money = (value) => (value ? `$${new Intl.NumberFormat('en-US').format(value)}` : null);

const formatRuntime = (minutes) => {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  return h ? `${h}h ${minutes % 60}m` : `${minutes}m`;
};

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movieLists, setMovieLists] = useState([]);
  const { addAlert } = React.useContext(AlertContext);
  const { adultContent } = React.useContext(SiteDataContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, (authUser) => setUser(authUser || null));
  }, []);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setShowAllRecs(false);
      setBlocked(false);
      try {
        const [details, credits, images, videos, recommendations] = await Promise.all([
          getMovie(id),
          getMovieCredits(id),
          getMovieImages(id),
          getMovieVideos(id),
          getMovieRecommendations(id),
        ]);
        if (!active) return;
        if (!adultContent && details.adult) {
          setBlocked(true);
          return;
        }
        setMovie({ ...details, credits, images, videos, recommendations });
        window.scrollTo(0, 0);
      } catch (error) {
        console.error(error);
        if (active) navigate('/404', { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [id, adultContent, navigate]);

  useEffect(() => {
    if (!user) return;
    getMovieListsByUserId(user.uid)
      .then((lists) => setMovieLists(lists.filter((list) => (list.users?.find((u) => u.uid === user.uid)?.accessType || 0) > 0)))
      .catch(console.error);
  }, [user]);

  const crew = useMemo(() => filterAdult(mergeCrew(movie?.credits?.crew), adultContent), [movie, adultContent]);

  const handleAddToList = async (event) => {
    const listId = event.target.value;
    if (!listId || !user) return;
    try {
      const list = await getMovieListById(listId);
      if ((list.movies || []).find((m) => m.id === movie.id)) throw new Error('Movie is already in "' + list.title + '"');
      // Strip bulky detail-page data so list documents stay well under Firestore's 1MB limit
      // eslint-disable-next-line no-unused-vars
      const { credits, images, videos, recommendations, ...summary } = movie;
      const entry = { ...summary, addedDate: new Date().toISOString(), addedBy: user.uid, watched: false };
      await addMovieToList(listId, entry);
      addAlert('success', `${movie.title} added to ${list.title}`);
    } catch (error) {
      addAlert('error', error.message);
    }
  };

  if (blocked) return <AdultContentNotice kind="movie" />;
  if (loading || !movie) return <DetailHeroSkeleton />;

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const stremioSlug = movie.imdb_id
    ? `${movie.title.replace(/[^\w\s]/gi, '').replace(/\s/g, '-').toLowerCase()}-${movie.imdb_id.substring(2)}`
    : null;
  const director = crew.find((c) => c.job.split(', ').includes('Director'));
  const recommendations = filterAdult(movie.recommendations, adultContent);
  const shownRecs = showAllRecs ? recommendations : recommendations.slice(0, 12);

  return (
    <>
      <DetailHero
        backdropPath={movie.backdrop_path}
        posterPath={movie.poster_path}
        title={movie.title}
        subtitle={movie.tagline}
        rating={movie.vote_average}
        voteCount={movie.vote_count}
        meta={[year, formatRuntime(movie.runtime), director && `Directed by ${director.name}`]}
        chips={(movie.genres || []).map((g) => g.name)}
        overview={movie.overview}
        actions={
          <>
            <AddToListSelect lists={movieLists} onSelect={handleAddToList} />
            <ExternalLinks
              links={[
                { label: 'IMDb', href: movie.imdb_id && `https://www.imdb.com/title/${movie.imdb_id}` },
                { label: 'TMDB', href: `https://www.themoviedb.org/movie/${movie.id}` },
              ]}
            />
          </>
        }
      />

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Section title="Where to watch">
          <WhereToWatch
            id={movie.id}
            fetchProviders={getMovieWatchProviders}
            stremioUrl={stremioSlug && `https://www.strem.io/s/movie/${stremioSlug}`}
          />
        </Section>

        <Section title="Details">
          <FactGrid
            facts={[
              { label: 'Released', value: movie.release_date && new Date(movie.release_date).toLocaleDateString() },
              { label: 'Runtime', value: formatRuntime(movie.runtime) },
              { label: 'Status', value: movie.status },
              { label: 'Language', value: movie.spoken_languages?.[0]?.english_name },
              { label: 'Budget', value: money(movie.budget) },
              { label: 'Revenue', value: money(movie.revenue) },
              { label: 'Studio', value: movie.production_companies?.slice(0, 2).map((c) => c.name).join(', ') },
              { label: 'Country', value: movie.production_countries?.slice(0, 2).map((c) => c.name).join(', ') },
            ]}
          />
        </Section>

        <Section title="Cast">
          <PeopleGrid people={filterAdult(movie.credits?.cast, adultContent)} getRole={(p) => p.character} />
        </Section>

        <Section title="Crew">
          <PeopleGrid people={crew} getRole={(p) => p.job} initialCount={8} />
        </Section>

        {recommendations.length > 0 && (
          <Section
            title="You might also like"
            action={
              recommendations.length > 12 && (
                <Typography component="button" onClick={() => setShowAllRecs(!showAllRecs)} sx={{ all: 'unset', cursor: 'pointer', color: 'primary.main', fontWeight: 600 }}>
                  {showAllRecs ? 'Show less' : 'Show all'}
                </Typography>
              )
            }
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {shownRecs.map((rec) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={rec.id}>
                  <MovieCard movie={rec} />
                </Grid>
              ))}
            </Grid>
          </Section>
        )}

        {(movie.videos?.results?.length > 0 || movie.images?.backdrops?.length > 0) && (
          <Section title="Media">
            <MediaDisplay videos={movie.videos?.results} images={movie.images?.backdrops} />
          </Section>
        )}

        <Section title="Reviews">
          <ReviewList id={movie.id} fetchReviews={getMovieReviews} />
        </Section>
      </Container>
    </>
  );
};

export default MovieDetailsPage;
