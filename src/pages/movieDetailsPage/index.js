import React, { useState, useEffect, useMemo} from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Autocomplete,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import MovieListSettings from '../../components/MovieComponents/movieListSettings';
import { getMovie, getMovieSearchResults } from '../../api/TMDBAPI';
import MovieTable from '../../components/MovieComponents/movieTable';
import { getMovieListById, addMovieToList, addMovieList, deleteMovieFromList, updateMovieInList} from '../../api/movieStorage';
import MovieAdd from '../../components/MovieComponents/movieAdd';
import { useParams } from 'react-router-dom';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const MovieDetailsPage = (props) => {
  const {id} = useParams();

  return (
    <Container>
      <Typography variant="h2">Movie Details for {id}</Typography>
    </Container>
  );
};

export default MovieDetailsPage;
