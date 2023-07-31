import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, CardMedia, IconButton, Grid} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {auth } from '../../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const MovieListCard = ({ movieList, onDelete }) => {
  const navigate = useNavigate();
  const [imageSrcs, setImageSrcs] = useState([]);
    const [user, setUser] = useState({});
    const [accessType, setAccessType] = useState(0)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        
 
    }, []);



  useEffect(() => {

      const posterPaths = movieList.movies.map((movie) => movie.poster_path);
      const imagePaths = posterPaths.map((path) => `https://image.tmdb.org/t/p/w200${path}`);
      setImageSrcs(imagePaths);
    
    setAccessType(accessType);

  }, [movieList.movies]);

  useEffect(() => {
    try{
    if (user.uid && movieList.users) {
        const userObj = movieList.users.find((userObj) => userObj.uid === user.uid);
        setAccessType(userObj.accessType);
    }
    } catch (error) {
      console.error('Error getting movie lists:', error);
    }
  }, [user]);

  return (
    <Card sx={{ padding: '2em' }} align="center">
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 2 }}>
        {movieList.title}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {imageSrcs.length >= 3 ? imageSrcs.map(value => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value).splice(0,4).map((src, index) => (
            <Grid item xs={6}>
          <CardMedia
            key={index}
            component="img"
            src={src}
            alt={`Poster ${index + 1}`}
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '1/1',
              objectFit: 'cover',
            }}
          />
            </Grid>
        )) : 
            <Grid item xs={12}>
            <CardMedia
                key={1}
                component="img"
                src={imageSrcs[0]}
                alt={`Poster 1`}
                style={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1/1',
                objectFit: 'cover',
                }}
            />
            </Grid>
      
    
    }
        </Grid>
      
      <Button
        variant="contained"
        size="large"
        sx={{ marginTop: '1em', marginRight: '1em' }}
        color="primary"
        onClick={() => navigate('/movielist/' + movieList.id)}
      >
        Open List
      </Button>
      {accessType < 2 ? null : (
        <IconButton
        variant="outlined"
        size="large"
        sx={{ marginTop: '.5em' }}
        color="primary"
        onClick={() => onDelete(movieList.id)}
        >
        <DeleteIcon fontSize="inherit" />
        </IconButton>
        )}
    </Card>
  );
};

export default MovieListCard;
