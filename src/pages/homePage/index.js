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
import { 
  getMovies, 
  getMovieSearchResults, 
  getTVShows, 
  getTVShowSearchResults 
} from '../../api/TMDBAPI';
import MovieCard from '../../components/MovieComponents/movieCard';
import TVCard from '../../components/TVComponents/TVCard';

const Homepage = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchData = async (page, selectedTab, query = '') => {
    setLoading(true);
    try {
      if (selectedTab === 0) {
        const results = query
          ? await getMovieSearchResults(page, query)
          : (await getMovies(page)).results;
        setMovies(results.slice(0, 18));
      } else {
        const results = query
          ? await getTVShowSearchResults(page, query)
          : (await getTVShows(page)).results;
        setShows(results.slice(0, 18));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let page = parseInt(urlParams.get('page')) || 1;

    if(page < 1 || page > 500){
      page = 1;
    }

    setCurrentPage(page);
    fetchData(page, tab, searchTerm);
  }, [tab, currentPage]);

  useEffect(() => {
    // Trigger new fetch whenever search term changes
    if (searchTerm !== '') {
      fetchData(1, tab, searchTerm); // Fetch from page 1 when searching
      setCurrentPage(1);
    } else {
      fetchData(currentPage, tab); // Fetch based on current page if search term is cleared
    }
  }, [searchTerm]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setCurrentPage(1);
    navigate(`?page=1`, { replace: true });
    setSearchTerm(''); // Clear search on tab change
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    navigate(`?page=${value}`, { replace: true });
    fetchData(value, tab, searchTerm);
  };

  return (
    <Box sx={{ padding: isMobile ? '2%' : '0% 10%', paddingBottom: '4em' }}>
      <Card sx={{ mt: 2, mb: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Movies" />
          <Tab label="TV Shows" />
        </Tabs>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
              Browse {tab === 0 ? 'Movies' : 'TV Shows'}
            </Typography>
            <Input 
              value={searchTerm} 
              onChange={handleSearchChange} 
              placeholder={`Search for ${tab === 0 ? 'movies' : 'TV shows'}`} 
            />
          </Stack>
        </CardContent>
      </Card>
      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
      ) : (
        <TableContainer component={Paper}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {(tab === 0 ? movies : shows).map((item, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                {tab === 0 ? <MovieCard movie={item} /> : <TVCard tv={item} />}
              </Grid>
            ))}
          </Grid>
          {searchTerm === '' && (
          <Pagination
            count={500}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
            onChange={handlePageChange}
            page={currentPage}
          />)}
        </TableContainer>
      )}
    </Box>
  );
};

export default Homepage;
