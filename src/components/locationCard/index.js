import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import WeatherCard from '../weatherCard';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const LocationCard = ({ weatherObject }) => {
  return (
    <Card variant="outlined" sx={{ margin: '2%' }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              {weatherObject.coords.name + ', ' + weatherObject.coords.country}
            </Typography>
          </Grid>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Grid container item spacing={2} wrap="nowrap">
              {weatherObject.data.hourly.map((hourlyData, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <WeatherCard
                    temperature={hourlyData.temperature}
                    description={hourlyData.description}
                    humidity={hourlyData.humidity}
                    time={hourlyData.time}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
