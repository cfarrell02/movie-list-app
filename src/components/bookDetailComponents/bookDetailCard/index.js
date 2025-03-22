import React, { useState, useEffect } from 'react';  // Grouped import statements
import { Card, CardContent, CardMedia, Typography, Grid, List, ListItem, ListItemText, Link } from '@mui/material';
import defaultImage from '../../../images/default.jpg';


const BookDetailCard = ({ book }) => {  // Destructuring the movie prop
  const [writers, setWriters] = useState([]);
  const [producers, setProducers] = useState([]);
  const [starring, setStarring] = useState([]);
  const [productionCompanies, setProductionCompanies] = useState([]);
  const [posterURL, setPosterURL] = useState('');

  useEffect(() => {
    // You might want to check if 'movie' exists before accessing its properties
    if (book && movie.credits) {
      setWriters(movie.credits.crew.filter((credit) => credit.job === 'Screenplay' || credit.job === 'Writer'));
      setProducers(movie.credits.crew.filter((credit) => credit.job === 'Producer'));
      setStarring(movie.credits.cast.filter((credit) => credit.order <= 5));
      setProductionCompanies(movie.production_companies);

      const localURL = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : defaultImage;
      setPosterURL(localURL);
    }
  }, [movie]);
try{
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia component="img"  src={posterURL} alt={book.title} />
      <CardContent>

        <Grid container spacing={2}>
          {writers.length > 0 ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Written By:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {writers.map((writer) => (
                <Link href={`/person/${writer.id}`}>
                <ListItem key={writer.id}><ListItemText primary={writer.name}/></ListItem>
                </Link>
              ))}
            </List>
          </Grid>
          </> ) : ''}

          {producers.length > 0 ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Produced By:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {producers.map((producer) => (
                <Link href={`/person/${producer.id}`}>
                <ListItem key={producer.id}><ListItemText primary={producer.name}/></ListItem>
                </Link>
              ))}
            </List>
          </Grid>
          </> ) : ''}
          {starring.length > 0 ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Starring:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {starring.map((star) => (
                <Link href={`/person/${star.id}`} key={star.id}>
                <ListItem key={star.id}><ListItemText primary={star.name}/></ListItem>
                </Link>
              ))}
            </List>
          </Grid>
          </> ) : ''}
          {productionCompanies.length > 0 ? ( <>
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
          </> ) : ''}
          {book.release_date ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Released:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
                <ListItem><ListItemText primary={(new Date(book.release_date)).toLocaleDateString()}/></ListItem>
            </List>
          </Grid>
          </> ) : ''}
          </Grid>
      </CardContent>
    </Card>
  );
}catch(err){
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6">
        Error loading book details
      </Typography>
    </Card>
  );
}
};

export default BookDetailCard;
