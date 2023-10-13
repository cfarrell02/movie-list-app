import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CardContent, Grid, Box, Input, Card, Stack, CircularProgress, Tab, Paper, TableContainer} from '@mui/material';
import { getMovies, getMovieSearchResults } from '../../api/TMDBAPI';
import MovieCard from '../../components/MovieComponents/movieCard';

const Homepage = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchMovies = async () => {
      try {
          setLoading(true);
          const fetchedMovies = await getMovies(1);
          setMovies(fetchedMovies.results.slice(0, 18));
          console.log(fetchedMovies)
      } catch (error) {
          console.error('Error getting movies:', error);
      } finally {
          setLoading(false);
      }
  };
    useEffect(() => {
        fetchMovies();
    }, []);
    const onChange = async (event) => {
        const  value  = event.target.value;
        if(value === '') return fetchMovies();
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



  return (
    <Box  sx={{paddingLeft: '10%', paddingRight:'10%', paddingBottom:'4em'}}>
 <Card
    sx={{
      marginTop: '20px', // Move card 20px away from siblings
      padding: '16px', // Adjust padding for more space
      marginBottom: '20px', // Wider spacing
      borderRadius: '12px', // Rounded corners
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
    }}
  >
    <CardContent>
      <Stack spacing={2}>
        <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          Browse Movies
        </Typography>
        <Input
          onChange={onChange}
          placeholder="Search for a movie"
        />
      </Stack>
    </CardContent>
  </Card>
      {loading ? ( 
        <CircularProgress align='center'/>
      ) : (
        <TableContainer component={Paper}>
          <Tab label="Movies">
          </Tab>
        <Grid container spacing={2}>
        {!movies ? null : movies.map((movie) => (
        <Grid item xs={6} md={2}>
        <MovieCard  movie={movie} />
        </Grid>
      ))}</Grid>
      </TableContainer>
      )}
      
    </Box>
  );
};

export default Homepage;
