import React, { useState, useEffect } from 'react';  // Grouped import statements
import { Card, CardContent, CardMedia, Typography, Grid, List, ListItem, ListItemText, Link } from '@mui/material';
import defaultImage from '../../../images/default.jpg';


const TVDetailCard = ({ tvShow }) => {  // Destructuring the tvShow prop
  const [creators, setCreators] = useState([]); 
  const [networks, setNetworks] = useState([]);
  const [starring, setStarring] = useState([]);
  const [productionCompanies, setProductionCompanies] = useState([]);
  const [posterURL, setPosterURL] = useState('');

  useEffect(() => {
    // You might want to check if 'tvShow' exists before accessing its properties
    if (tvShow && tvShow.credits) {
      setCreators(tvShow.created_by);
      setNetworks(tvShow.networks);
      setStarring(tvShow.credits.filter((credit) => credit.order <= 5));
      setProductionCompanies(tvShow.production_companies);

      const localURL = tvShow.poster_path ? `https://image.tmdb.org/t/p/original${tvShow.poster_path}` : tvShow.backdrop_path ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}` : defaultImage;
      setPosterURL(localURL);
    }
  }, [tvShow]);
try{
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia component="img"  src={posterURL} alt={tvShow.title} />
      <CardContent>

        <Grid container spacing={2}>
        {creators.length > 0 ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Created By:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {creators.map((star) => (
                <Link href={`/person/${star.id}`} key={star.id}>
                <ListItem key={star.id}><ListItemText primary={star.name}/></ListItem>
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
          {networks.length > 0 ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Networks:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              {networks.map((star) => (
                <ListItem key={star.id}><ListItemText primary={star.name}/></ListItem>
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
          {tvShow.release_date ? ( <>
          <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
              Released:
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
                <ListItem><ListItemText primary={(new Date(tvShow.release_date)).toLocaleDateString()}/></ListItem>
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
        Error loading tvShow details
      </Typography>
    </Card>
  );
}
};

export default TVDetailCard;
