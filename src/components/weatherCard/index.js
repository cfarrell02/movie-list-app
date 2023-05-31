import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const WeatherCard = ({ temperature, description, humidity, time }) => {
  return (
    <Card variant="outlined" sx={{ margin: '5%' , height: "140px", width: "200px"}}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              <ThermostatIcon/>{'\u00A0'}{temperature}°C
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              Humidity: {humidity}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" color="text.secondary">
              {time.substring(11, 16)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
