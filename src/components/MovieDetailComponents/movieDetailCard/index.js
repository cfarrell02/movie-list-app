import React, { useState, useEffect } from 'react';  // Grouped import statements
import { Card, CardContent, CardMedia, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';


const MovieDetailCard = ({ movie }) => {  // Destructuring the movie prop
  const [director, setDirector] = useState({}); 
  const [writers, setWriters] = useState([]);
  const [producers, setProducers] = useState([]);
  const [starring, setStarring] = useState([]);
  const [productionCompanies, setProductionCompanies] = useState([]);

  useEffect(() => {
    // You might want to check if 'movie' exists before accessing its properties
    console.log(movie)
    if (movie && movie.credits) {
      setDirector(movie.credits.crew.find((credit) => credit.job === 'Director'));
      setWriters(movie.credits.crew.filter((credit) => credit.job === 'Screenplay' || credit.job === 'Writer'));
      setProducers(movie.credits.crew.filter((credit) => credit.job === 'Producer'));
      setStarring(movie.credits.cast.filter((credit) => credit.order <= 5));
      setProductionCompanies(movie.production_companies);

    }
  }, [movie]);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia component="img"  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
      <CardContent>

        <Grid container spacing={2}>
          <Grid item xs={6} sx={{marginTop:'.9em'}}>
            <Typography variant="h6">
              Directed By:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              <ListItem>
              <ListItemText primary={director.name} />
                </ListItem>
            </List>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Written By:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {writers.map((writer) => (
                <ListItem key={writer.id}><ListItemText primary={writer.name}/></ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Produced By:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {producers.map((producer) => (
                <ListItem key={producer.id}><ListItemText primary={producer.name}/></ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Starring:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {starring.map((star) => (
                <ListItem key={star.id}><ListItemText primary={star.name}/></ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              {productionCompanies.length > 1 ? 'Production Companies:' : 'Production Company:'}
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {productionCompanies.map((company) => (
                <ListItem key={company.id}><ListItemText primary={company.name}/></ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Released:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
                <ListItem><ListItemText primary={(new Date(movie.release_date)).toLocaleDateString()}/></ListItem>
            </List>
          </Grid>
          </Grid>
      </CardContent>
    </Card>
  );
};

export default MovieDetailCard;
