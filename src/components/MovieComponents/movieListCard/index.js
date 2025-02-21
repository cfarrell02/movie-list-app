import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, CardMedia, IconButton, Grid, Container} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {auth } from '../../../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';
import defaultImage from '../../../images/default.jpg';

const MovieListCard = ({ movieList, onDelete }) => {
  const navigate = useNavigate();
  const [imageSrcs, setImageSrcs] = useState([]);
    const [user, setUser] = useState({});
    const [accessType, setAccessType] = useState(0)

    const getUserType = () => {
      switch (accessType) {
        case 0:
          return 'Viewer';
        case 1:
          return 'Contributor';
        case 2:
          return 'Admin';
        case 3:
          return 'Owner';
        default:
          return 'Viewer';
      }
    };

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
      const tvPosterPaths = movieList.tvShows.map((tvShow) => tvShow.poster_path);
      const imagePaths = posterPaths.map((path) => `https://image.tmdb.org/t/p/w500${path}`);
      imagePaths.push(...tvPosterPaths.map((path) => `https://image.tmdb.org/t/p/w500${path}`));
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
      console.error('Error getting watch lists:', error);
    }
  }, [user]);

  return (
    <Card sx={{ padding: '2em', height: '30em' }} align="center">
      <Typography variant="h5" component="h1" align="center" sx={{ mb: 2 }}>
        {movieList.title}
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>
        {getUserType()}
      </Typography>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        
        {
          imageSrcs.length <= 0 ?
            <Grid item xs={12}>
              <CardMedia
                key={0}
                component="img"
                src={defaultImage}
                alt={`Poster 1`}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                }}
              />
            </Grid>
            :
        
        imageSrcs.length >= 3 ? imageSrcs.map(value => ({ value, sort: Math.random() }))
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
        sx={{ marginTop: '1em', marginRight: '.5em' }}
        color="primary"
        onClick={() => navigate('/movielist/' + movieList.id + '?tab=0')}
        title="Movies"
      >
        Movies
      </Button>
      <Button
        variant="contained"
        size="large"
        sx={{ marginTop: '1em', marginRight: '1em' }}
        color="primary"
        onClick={() => navigate('/movielist/' + movieList.id + '?tab=1')}
        title="TV Shows"
      >
        TV Shows
      </Button>
      {accessType < 2 ? null : (
        <IconButton
        variant="outlined"
        size="large"
        sx={{ marginTop: '.5em' }}
        color="primary"
        onClick={() => onDelete(movieList.id)}
        title = "Delete List"
        >
        <DeleteIcon fontSize="inherit"/>
        </IconButton>
        )}
    </Card>
  );
};

export default MovieListCard;
