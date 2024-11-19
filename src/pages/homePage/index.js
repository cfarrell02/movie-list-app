import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  Typography,
  CardContent,
  Grid,
  Box,
  Input,
  Card,
  Stack,
  CircularProgress,
  Tab,
  Paper,
  TableContainer,
  useMediaQuery,
  Pagination,
} from '@mui/material';
import { getMovies, getMovieSearchResults, getTVShows, getTVShowSearchResults } from '../../api/TMDBAPI';
import MovieCard from '../../components/MovieComponents/movieCard';
import TVCard from '../../components/TVComponents/TVCard';

const Homepage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [moviePage, setMoviePage] = useState(1);
  const [showPage, setShowPage] = useState(1);
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchMovies = async (value, selectedTab) => {
    try {
      setLoading(true);
      if (selectedTab === 0) {
        const fetchedMovies = await getMovies(value);
        setMovies(fetchedMovies.results.slice(0, 18));
      } else {
        const fetchedShows = await getTVShows(value);
        setShows(fetchedShows.results.slice(0, 18 ));
      }

    } catch (error) {
      console.error('Error getting movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    //Look for page param in url
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    if (page) {
      const parsedPage = parseInt(page);
      if (parsedPage && parsedPage > 0 && parsedPage < 501) {
        if (tab === 0) {
          setMoviePage(parsedPage);
        } else {
          setShowPage(parsedPage);
        }

        fetchMovies(parsedPage, tab);
        return;
      }
    }else{
      navigate(`?page=${tab === 0 ? moviePage : showPage}`, { replace: true });
    }

    fetchMovies(tab === 0 ? moviePage : showPage, tab);
  }, []);

  const onChange = async (event) => {
    const value = event.target.value;
    if (value === '') return fetchMovies();
    try {
      setLoading(true);
      const fetchedMovies = await getMovieSearchResults(1, value);
      console.log(fetchedMovies);
      setMovies(fetchedMovies.slice(0, 18));
    } catch (error) {
      console.error('Error getting movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const onPaginationChange = async (event, value) => {
    if (tab === 0) {
      setMoviePage(value);
    } else {
      setShowPage(value);
    }

    //Update the url
    navigate(`?page=${value}`, { replace: true });

    fetchMovies(value, tab);
  };


  return (
    <Box sx={{ paddingLeft: isMobile ? '2%' : '10%', paddingRight: isMobile ? '2%' : '10%', paddingBottom: '4em' }}>
      <Card
        sx={{
          marginTop: '20px',
          padding: '16px',
          marginBottom: '20px',
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, newValue) => {
            setTab(newValue);
            fetchMovies(newValue === 0 ? moviePage : showPage, newValue);
          }}
        >
          <Tab label="Movies" />
          <Tab label="TV Shows" />
        </Tabs>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
              Browse {tab === 0 ? 'Movies' : 'TV Shows'}
            </Typography>
            <Input onChange={onChange} placeholder={`Search for ${tab === 0 ? 'movies' : 'TV shows'}`} />
          </Stack>
        </CardContent>
      </Card>
      {loading ? (
        <CircularProgress align="center" />
      ) : (
        <TableContainer component={Paper}>
          {tab === 0 ? (
            <Grid container spacing={2} sx={{ padding: '1em' }}>
              {!movies ? null : movies.map((movie, index) => (
                <Grid item xs={6} md={2} key={index}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2} sx={{ padding: '1em' }}>
              {!shows ? null : shows.map((show, index) => (
                <Grid item xs={6} md={2} key={index}>
                  <TVCard tv={show} />
                </Grid>
              ))}
            </Grid>
          )}

          <Pagination
            count={500}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2em' }}
            onChange={onPaginationChange}
            page={tab === 0 ? moviePage : showPage}

          />
        </TableContainer>
      )}
    </Box>
  );
};

export default Homepage;
