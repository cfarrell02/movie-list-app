import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const WeatherCard = ({ location, temperature, description, humidity }) => {
  return (
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h6" component="div">
                {location}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="text.secondary">
                <ThermostatIcon /> {temperature}°C
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" color="text.secondary">
                Description: {description}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary">
                Humidity: {humidity}%
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  );
};

export default WeatherCard;
