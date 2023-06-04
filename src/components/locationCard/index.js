import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import WeatherCard from '../weatherCard';
import { formateName } from '../../utils';
import weatherTable from '../weatherTable';
import WeatherTable from '../weatherTable';

const LocationCard = ({ weatherObject }) => {
  const currentWeather = weatherObject.data.hourly.filter((hourlyData) => hourlyData.isCurrent)[0];
  return (
  
    <Card variant="outlined" sx={{ margin: '2%' }} >
      <CardContent>
        <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            {formateName(weatherObject.coords)}
          </Typography>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            {currentWeather.temperature + weatherObject.data.hourly_units.temperature_2m}
          </Typography>
        </Grid>
        
          <Grid item xs={12}>
            
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            Hourly Forecast </Typography>
          <div style={{ width: '100%' , overflowX: 'auto'}}>
            <Grid container item spacing={2} wrap="nowrap">
              {weatherObject.data.hourly.map((hourlyData, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <WeatherCard
                    temperature={hourlyData.temperature}
                    description={hourlyData.description}
                    precipitationProbability={hourlyData.precipitationProbability}
                    time={hourlyData.time}
                    focused={hourlyData.isCurrent}
                    sunrise={weatherObject.data.daily.filter((dailyData) => dailyData.time.getDate() === hourlyData.time.getDate())[0].sunrise}
                    sunset={weatherObject.data.daily.filter((dailyData) => dailyData.time.getDate() === hourlyData.time.getDate())[0].sunset}
                    
                  />
                </Grid>
              ))}
            </Grid>
          </div>
          <Typography variant="h6" component="div" sx={{ textAlign: 'center' }}>
            Daily Forecast </Typography>
          <WeatherTable days={weatherObject.data.daily} />


          </Grid>
          
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
