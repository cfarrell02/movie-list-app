import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, Typography, Grid, CardMedia } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { weatherCodeIcons, weatherCodeTranslator, dayOfTheWeek } from '../../utils';


const WeatherCard = ({ temperature, description, humidity, time, focused, sunset, sunrise}) => {
  const cardRef = useRef(null);
  const isDaytime = time.getHours() >= sunrise.getHours() && time.getHours() <= sunset.getHours();
  useEffect(() => {
    if (focused) {
      cardRef.current.focus();
    }
  }, [focused]);


  


  return (
    <Card
      variant="outlined"
      sx={{
        margin: '5%',
        height: '200px',
        width: '200px',
        outline: focused ? '2px solid #3f51b5' : 'none',
      }}
      tabIndex={0}
      ref={cardRef}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2}/>
          <Grid item xs={8}>
          <CardMedia component="img" image={weatherCodeIcons(isDaytime ? description : (-parseInt(description) - 1))}
           alt={weatherCodeTranslator(description)} />
          </Grid>
          <Grid item xs={2}/>
          <Grid item xs={7}>
          <Typography variant="body1" color="text.secondary">
              <ThermostatIcon />
              {'\u00A0'}
              {temperature}°C
            </Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body1" color="text.secondary">
              {dayOfTheWeek(time.getDay()) + ' ' + time.getHours() + ':00'}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
