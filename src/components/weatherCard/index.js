import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { weatherCodeIcons, weatherCodeTranslator } from '../../utils';
import SvgIcon from '@mui/material/SvgIcon';

const WeatherCard = ({ temperature, description, humidity, time, focused }) => {
  const cardRef = useRef(null);
  const iconPath = '../../images/' + weatherCodeIcons(description);
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
        height: '140px',
        width: '200px',
        backgroundColor: focused ? 'lightblue' : 'white',
      }}
      tabIndex={0}
      ref={cardRef}
    >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              <ThermostatIcon />
              {'\u00A0'}
              {temperature}°C
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              Humidity: {humidity}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
          <img src={iconPath} alt= {weatherCodeTranslator(description)} /> // TODO: Fix this

          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              {time.substring(11, 16) + ' ' + time.substring(8, 10) + '/' + time.substring(5, 7)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
