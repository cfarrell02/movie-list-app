import React, { useEffect, useState, useRef } from 'react';
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
  Button,
} from '@mui/material';
import { 
  getTrendingMovies, 
  getMovieSearchResults, 
  getTrendingTVShows, 
  getTVShowSearchResults 
} from '../../api/TMDBAPI';
import { getBooks, getBookSearchResults } from '../../api/bookAPI';
import MovieCard from '../../components/MovieComponents/movieCard';
import BookCard from '../../components/bookComponents/bookCard';
import TVCard from '../../components/TVComponents/TVCard';
import { FeatureFlagContext } from '../../contexts/featureFlagContext';

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Homepage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [books, setBooks] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const {getFeatureFlag} = React.useContext(FeatureFlagContext);

  const fetchData = async (page, selectedTab, query = '') => {
    setLoading(true);
    const cacheKey = `${selectedTab}-${page}-${query}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (selectedTab === 0) {
        setMovies(parsedData);
      } else if (selectedTab === 2) {
        setBooks(parsedData);
      } else {
        setShows(parsedData);
      }
      setLoading(false);
      return;
    }

    try {
      let results;
      if (selectedTab === 0) {
        results = query
          ? await getMovieSearchResults(page, query)
          : (await getTrendingMovies(page)).results;
        setMovies(results.slice(0, 18));
      } else if (selectedTab === 2) {
        results = query ? (await getBookSearchResults(page, query, 18)).docs : (await getBooks(page, 18)).works;
        setBooks(results);
      } else {
        results = query
          ? await getTVShowSearchResults(page, query)
          : (await getTrendingTVShows(page)).results;
        setShows(results.slice(0, 18));
      }
      localStorage.setItem(cacheKey, JSON.stringify(results.slice(0, 18)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let page = parseInt(urlParams.get('page')) || 1;
    if (searchTerm !== '') {
      fetchData(1, tab, searchTerm);
      setCurrentPage(1);
    } else {
      fetchData(currentPage, tab);
    }
  }, [tab]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setCurrentPage(1);
    navigate(`?tab=${newValue}&page=1`, { replace: true });
    setSearchTerm('');
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    navigate(`?tab=${tab}&page=${value}`, { replace: true });
    fetchData(value, tab, searchTerm);
  };

  return (
    <Box sx={{ padding: isMobile ? '2%' : '0% 10%', paddingBottom: '4em' }}>
      <Card sx={{ mt: 2, mb: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Movies" />
          <Tab label="TV Shows" />
          
          {getFeatureFlag('Books').enabled && <Tab label="Books" />}
        </Tabs>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
              Browse {tab === 0 ? 'Movies' : tab === 1 ? 'TV Shows' : 'Books'}
            </Typography>
            <Box component="form" onSubmit={(e) => { e.preventDefault(); fetchData(1, tab, searchTerm); setCurrentPage(1); }}>
              <Stack direction="row" spacing={2}>
                <Input 
                  value={searchTerm} 
                  onSubmit={(e) => { e.preventDefault(); fetchData(1, tab, searchTerm); setCurrentPage(1); }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search for ${tab === 0 ? 'movies' : tab === 1 ? 'TV shows' : 'books'}`}
                  fullWidth
                />
                <Button type="submit" variant="contained" onClick = {() => fetchData(1, tab, searchTerm)}>Search</Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <TableContainer component={Paper}>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              {movies.map((movie, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              {shows.map((show, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <TVCard tv={show} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Grid container spacing={2} sx={{ p: 2 }}>
              {books.map((book, index) => (
                <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                  <BookCard book={book} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>
          {searchTerm === '' && (
            <Pagination
              count={500}
              color="primary"
              sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
              onChange={handlePageChange}
              page={currentPage}
            />
          )}
        </TableContainer>
      )}
    </Box>
  );
};

export default Homepage;
