import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import LocationCard from '../../components/locationCard';
import { fetchWeatherData, fetchGeoLocation } from '../../api/weatherAPI';
import { weatherCodeTranslator } from '../../utils';

function HomePage() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const coords = (await fetchGeoLocation(location)).results;  
      const data = await fetchWeatherData(coords[0].latitude, coords[0].longitude);
      let hourlyData = [];
  
      for (let i = 0; i < data.hourly.time.length; i++) {
        let currentDate = (new Date()).getDay() === parseInt(data.hourly.time[i].substring(8, 10));
        hourlyData.push({
          time: data.hourly.time[i],
          temperature: data.hourly.temperature_2m[i],
          description: weatherCodeTranslator(data.hourly.weathercode[i]),
          humidity: data.hourly.relativehumidity_2m[i],
          isCurrent: currentDate
        });
      }
      data.hourly = hourlyData;
      console.log(data);
      const newData = { coords: coords[0], data };
      setWeatherData(prevData => [newData, ...prevData]);
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
    <Container maxWidth="xl" sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Weather App
      </Typography>
      <TextField
        label="Enter location"
        variant="outlined"
        value={location}
        onChange={handleLocationChange}
        fullWidth
        sx={{ marginBottom: '1rem' }}
      />
      <Button variant="contained" onClick={fetchWeather} fullWidth>
        Get Weather
      </Button>
      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: '1rem' }}>
          {error}
        </Typography>
      )}
      {weatherData && (
        <div style={{ marginTop: '1rem' }}>
          {weatherData.map((data, index) => (
            <LocationCard key={index} weatherObject={data} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default HomePage;
