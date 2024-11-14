import React, { useState, useEffect } from 'react';  // Grouped import statements
import { Card, CardContent, CardMedia, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import { ageFormatter } from '../../../utils';


const PersonDetailsCard = ({ person }) => {  // Destructuring the movie prop


  useEffect(() => {
    // You might want to check if 'movie' exists before accessing its properties

    if (person ) {


    }
  }, [person]);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CardMedia component="img"  src={`https://image.tmdb.org/t/p/original${person.profile_path}`} alt={person.name} />
      <CardContent>

        <Grid container spacing={2}>
          <Grid item xs={6} sx={{marginTop:'.9em'}}>
            <Typography variant="h6">
              Born
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
              <ListItem>
              <ListItemText primary={person.name} />
                </ListItem>
                {person.birthday ? (
                <ListItem>
              <ListItemText primary={new Date(person.birthday).toLocaleDateString()+ ' '+ ageFormatter(person.birthday)+ '\u00A0Years Old'} />
                </ListItem>
                ) : ''}
                <ListItem>
              <ListItemText primary={person.place_of_birth} />
                </ListItem>
            </List>
          </Grid>
          {person.deathday ? ( <>
            <Grid item xs={6}>
            <Typography variant="h6"  sx={{marginTop:'.7em'}}>
                Died
            </Typography>
            </Grid>
            <Grid item xs={6}>
            <List>
                <ListItem>
                <ListItemText primary={new Date(person.deathday).toLocaleDateString()} />
                </ListItem>
            </List>
            </Grid> </>
            ) : null}
          </Grid>
      </CardContent>
    </Card>
  );
};

export default PersonDetailsCard;
