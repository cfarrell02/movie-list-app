import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Box, Input, Card, Stack, CircularProgress} from '@mui/material';
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
    <Box  sx={{paddingLeft: '10%', paddingRight:'10%' }}>
      <Card spacing={2} sx={{padding:'5%', marginBottom:'5%', display:'flex', justifyContent:'center', marginLeft:'20%', marginRight:'20%', marginTop:'2%'}}>
        <Stack spacing={2}>
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Browse Movies
      </Typography>
      <Input onChange={onChange} placeholder="Search for a movie" />
      </Stack>
      </Card>
      {loading ? ( 
        <CircularProgress align='center'/>
      ) : (
        <Grid container spacing={2}>
        {!movies ? null : movies.map((movie) => (
        <Grid item xs={6} md={2}>
        <MovieCard  movie={movie} />
        </Grid>
      ))}</Grid>
      )}
      
    </Box>
  );
};

export default Homepage;
