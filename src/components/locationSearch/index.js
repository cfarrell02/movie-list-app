import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { fetchGeoLocation, fetchWeatherData } from '../../api/weatherAPI';
import { weatherCodeTranslator } from '../../utils';
import LocationCard from '../locationCard';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

const LocationSearch = ({ title }) => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
    const maxHours = 48;

    const fetchLocations = async (location) => {
        try {
            const data = (await (fetchGeoLocation(location))).results;
            return data;
        } catch (error) {
            throw new Error('An error occurred while fetching geo location data.');
        }
    }

    


  const fetchWeather = async () => {
    try {
      const coords = (await fetchGeoLocation(location)).results[0];
      const data = await fetchWeatherData(coords.latitude, coords.longitude);
      const currentTime = new Date();
      let hourlyData = [];
      for (let i = 0; i < maxHours; i++) {
        let currentDate =
          currentTime.getDate() === parseInt(data.hourly.time[i].substring(8, 10)) &&
          currentTime.toTimeString().substring(0, 2) === data.hourly.time[i].substring(11, 13);
        hourlyData.push({
          time: data.hourly.time[i],
          temperature: data.hourly.temperature_2m[i],
          description: weatherCodeTranslator(data.hourly.weathercode[i]),
          humidity: data.hourly.relativehumidity_2m[i],
          isCurrent: currentDate,
        });
      }
      data.hourly = hourlyData;
      const newData = { coords: coords, data };
      setWeatherData((prevData) => [newData, ...prevData]);
      setError('');
    } catch (error) {
      setWeatherData([]);
      setError(error.message);
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Card variant="outlined" sx={{ margin: '2%' }}>
      <CardContent>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {title}
        </Typography>
        
            <TextField
              label="Enter Location"
              variant="outlined"
              onChange={handleLocationChange}
              fullWidth
              sx={{ marginBottom: '1rem' }}
            />
          
        
        <Button variant="contained" onClick={fetchWeather} fullWidth>
          Get Weather
        </Button>
      </CardContent>
      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}
      {weatherData.map((data, index) => (
        <div key={index} style={{ marginTop: '1rem' }}>
          <LocationCard weatherObject={data} />
        </div>
      ))}
    </Card>
  );
};

LocationSearch.propTypes = {
  title: PropTypes.string.isRequired,
};

export default LocationSearch;
