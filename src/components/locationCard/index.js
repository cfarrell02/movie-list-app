import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import WeatherCard from '../weatherCard';
import ThermostatIcon from '@mui/icons-material/Thermostat';

const LocationCard = ({ weatherObject }) => {
  const currentWeather = weatherObject.data.hourly.filter((hourlyData) => hourlyData.isCurrent)[0];
  return (
    <Card variant="outlined" sx={{ margin: '2%' }} >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
                <Grid item xs={2}>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            {weatherObject.coords.name + ', ' + weatherObject.coords.country}
          </Typography>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            {currentWeather.temperature + '°C'}
          </Typography>
        </Grid>
        
          <Grid item xs={10}>
            <Card variant="outlined" sx={{ paddingLeft: '5%', paddingRight: "5%" }}>
          <div style={{ width: '100%' , overflowX: 'auto'}}>
            <Grid container item spacing={2} wrap="nowrap">
              {weatherObject.data.hourly.map((hourlyData, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <WeatherCard
                    temperature={hourlyData.temperature}
                    description={hourlyData.description}
                    humidity={hourlyData.humidity}
                    time={hourlyData.time}
                    focused={hourlyData.isCurrent}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Card>
          </Grid>
          
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
