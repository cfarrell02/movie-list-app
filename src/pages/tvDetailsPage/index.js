import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { getTVShow, getTVCredits, getTVImages, getTVVideos, getTVRecommendations, getTVReviews } from '../../api/TMDBAPI';
import { getMovieListById, addTVShowToList, getMovieListsByUserId } from '../../api/movieStorage';
import { auth } from '../../firebase-config';
import { AlertContext } from '../../contexts/alertContext';
import { SiteDataContext } from '../../contexts/siteDataContext';
import { filterAdult } from '../../utils';
import MediaDisplay from '../../components/mediaDisplay';
import TVCard from '../../components/TVComponents/TVCard';
import TVEpisodesSummary from '../../components/TVDetailComponents/tvEpisodesSummary';
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
} from '../../components/detail';

const yearOf = (date) => (date ? new Date(date).getFullYear() : null);

const TVDetailsPage = () => {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [movieLists, setMovieLists] = useState([]);
  const { addAlert } = React.useContext(AlertContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllRecs, setShowAllRecs] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const { adultContent } = React.useContext(SiteDataContext);
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
        const [details, cast, images, videos, recommendations] = await Promise.all([
          getTVShow(id),
          getTVCredits(id),
          getTVImages(id),
          getTVVideos(id),
          getTVRecommendations(id),
        ]);
        if (!active) return;
        if (!adultContent && details.adult) {
          setBlocked(true);
          return;
        }
        setTvShow({ ...details, credits: cast, images, videos, recommendations });
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

  const handleAddToList = async (event) => {
    const listId = event.target.value;
    if (!listId || !user) return;
    try {
      const list = await getMovieListById(listId);
      if ((list.tvShows || []).find((m) => m.id === tvShow.id)) throw new Error('TV show is already in "' + list.title + '"');
      // Strip bulky detail-page data so list documents stay well under Firestore's 1MB limit
      // eslint-disable-next-line no-unused-vars
      const { credits, images, videos, recommendations, ...summary } = tvShow;
      const entry = { ...summary, addedDate: new Date().toISOString(), addedBy: user.uid, watched: 0 };
      await addTVShowToList(listId, entry);
      addAlert('success', `${tvShow.name} added to ${list.title}`);
    } catch (error) {
      addAlert('error', error.message);
    }
  };

  if (blocked) return <AdultContentNotice kind="show" />;
  if (loading || !tvShow) return <DetailHeroSkeleton />;

  const start = yearOf(tvShow.first_air_date);
  const end = tvShow.in_production ? 'Present' : yearOf(tvShow.last_air_date);
  const years = start ? (end && end !== start ? `${start} – ${end}` : `${start}`) : null;
  const seasons = (tvShow.seasons || []).filter((s) => s.name !== 'Specials');
  const recommendations = filterAdult(tvShow.recommendations, adultContent);
  const shownRecs = showAllRecs ? recommendations : recommendations.slice(0, 12);

  return (
    <>
      <DetailHero
        backdropPath={tvShow.backdrop_path}
        posterPath={tvShow.poster_path}
        title={tvShow.name}
        subtitle={tvShow.tagline}
        rating={tvShow.vote_average}
        voteCount={tvShow.vote_count}
        meta={[
          years,
          seasons.length ? `${seasons.length} ${seasons.length === 1 ? 'season' : 'seasons'}` : null,
          tvShow.networks?.[0]?.name,
        ]}
        chips={(tvShow.genres || []).map((g) => g.name)}
        overview={tvShow.overview}
        actions={
          <>
            <AddToListSelect lists={movieLists} onSelect={handleAddToList} />
            <ExternalLinks links={[{ label: 'TMDB', href: `https://www.themoviedb.org/tv/${tvShow.id}` }]} />
          </>
        }
      />

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Section title="Details">
          <FactGrid
            facts={[
              { label: 'First aired', value: tvShow.first_air_date && new Date(tvShow.first_air_date).toLocaleDateString() },
              { label: 'Last aired', value: tvShow.last_air_date && new Date(tvShow.last_air_date).toLocaleDateString() },
              { label: 'Status', value: tvShow.status },
              { label: 'Episodes', value: tvShow.number_of_episodes },
              { label: 'Seasons', value: seasons.length || null },
              { label: 'Network', value: tvShow.networks?.map((n) => n.name).slice(0, 2).join(', ') },
              { label: 'Created by', value: tvShow.created_by?.map((c) => c.name).join(', ') },
              { label: 'Language', value: tvShow.spoken_languages?.[0]?.english_name },
            ]}
          />
        </Section>

        {seasons.length > 0 && (
          <Section title="Episode ratings">
            <TVEpisodesSummary tvShow={tvShow} />
          </Section>
        )}

        <Section title="Cast">
          <PeopleGrid people={filterAdult(tvShow.credits, adultContent)} getRole={(p) => p.character} />
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
                  <TVCard tv={rec} />
                </Grid>
              ))}
            </Grid>
          </Section>
        )}

        {(tvShow.videos?.results?.length > 0 || tvShow.images?.backdrops?.length > 0) && (
          <Section title="Media">
            <MediaDisplay videos={tvShow.videos?.results} images={tvShow.images?.backdrops} />
          </Section>
        )}

        <Section title="Reviews">
          <ReviewList id={tvShow.id} fetchReviews={getTVReviews} />
        </Section>
      </Container>
    </>
  );
};

export default TVDetailsPage;
