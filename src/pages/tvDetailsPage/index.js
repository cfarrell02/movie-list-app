import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { getTVShow, getTVCredits, getTVImages, getTVVideos, getTVRecommendations, getTVReviews, getTVWatchProviders, getTVExternalIDs, getTitlesFromCompany } from '../../api/TMDBAPI';
import { getMovieListById, addTVShowToList, getMovieListsByUserId } from '../../api/movieStorage';
import { auth } from '../../firebase-config';
import { AlertContext } from '../../contexts/alertContext';
import { SiteDataContext } from '../../contexts/siteDataContext';
import { filterAdult } from '../../utils';
import { toListEntry } from '../../listTransfer';
import MediaDisplay from '../../components/mediaDisplay';
import TVCard from '../../components/TVComponents/TVCard';
import TVEpisodesSummary from '../../components/TVDetailComponents/tvEpisodesSummary';
import WhereToWatch from '../../components/whereToWatch';
import {
  AdultContentNotice,
  AddToListSelect,
  DetailHero,
  DetailHeroSkeleton,
  ExternalLinks,
  FactSection,
  MoreFromCompany,
  PeopleGrid,
  ReviewList,
  Section,
  TitleGridSection,
  hasPlayableMedia,
} from '../../components/detail';

const yearOf = (date) => (date ? new Date(date).getFullYear() : null);

const TVDetailsPage = () => {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [movieLists, setMovieLists] = useState([]);
  const { addAlert } = React.useContext(AlertContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchAvailable, setWatchAvailable] = useState(true);
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
      setWatchAvailable(true);
      setBlocked(false);
      try {
        const [details, cast, images, videos, recommendations, externalIds] = await Promise.all([
          getTVShow(id),
          getTVCredits(id),
          getTVImages(id),
          getTVVideos(id),
          getTVRecommendations(id),
          // Only needed for the IMDb/Stremio links, so a failure shouldn't break the page
          getTVExternalIDs(id).catch(() => ({})),
        ]);
        if (!active) return;
        if (!adultContent && details.adult) {
          setBlocked(true);
          return;
        }
        setTvShow({ ...details, imdb_id: externalIds.imdb_id, credits: cast, images, videos, recommendations });
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
      const entry = { ...toListEntry(tvShow, 'tv'), addedDate: new Date().toISOString(), addedBy: user.uid, watched: 0 };
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
  const stremioUrl = tvShow.imdb_id && `https://web.stremio.com/#/detail/series/${tvShow.imdb_id}`;
  const cast = filterAdult(tvShow.credits, adultContent);

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
            <ExternalLinks
              links={[
                { label: 'IMDb', href: tvShow.imdb_id && `https://www.imdb.com/title/${tvShow.imdb_id}` },
                { label: 'TMDB', href: `https://www.themoviedb.org/tv/${tvShow.id}` },
                // Stremio normally sits in "Where to watch"; show it here when that section is hidden
                { label: 'Stremio', href: !watchAvailable && stremioUrl },
              ]}
            />
          </>
        }
      />

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <WhereToWatch id={tvShow.id} fetchProviders={getTVWatchProviders} stremioUrl={stremioUrl} onAvailability={setWatchAvailable} />

        <FactSection
          title="Details"
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

        {seasons.length > 0 && (
          <Section title="Episode ratings">
            <TVEpisodesSummary tvShow={tvShow} />
          </Section>
        )}

        {cast.length > 0 && (
          <Section title="Cast">
            <PeopleGrid people={cast} getRole={(p) => p.character} />
          </Section>
        )}

        <TitleGridSection title="You might also like" items={recommendations} renderItem={(rec) => <TVCard tv={rec} />} />

        <MoreFromCompany
          companies={tvShow.networks}
          currentId={tvShow.id}
          fetchTitles={(networkId) => getTitlesFromCompany('tv', networkId)}
          filterItems={(items) => filterAdult(items, adultContent)}
          renderItem={(item) => <TVCard tv={item} />}
        />

        {hasPlayableMedia(tvShow.videos?.results, tvShow.images?.backdrops) && (
          <Section title="Media">
            <MediaDisplay videos={tvShow.videos?.results} images={tvShow.images?.backdrops} />
          </Section>
        )}

        <ReviewList id={tvShow.id} fetchReviews={getTVReviews} title="Reviews" />
      </Container>
    </>
  );
};

export default TVDetailsPage;
