import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import WeatherCard from '../../components/weatherCard';
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
      const newData = { coords, data };
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
    <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
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
        weatherData.map((data) => (
        <WeatherCard
        location={`${data.coords[0].name}, ${data.coords[0].country}`}
          temperature={data.data.hourly.temperature_2m[0]}
          description={weatherCodeTranslator(data.data.hourly.weathercode[0])}
          humidity={data.data.hourly.relativehumidity_2m[0]}
        />
        ))
      )}
    </Container>
  );
}

export default HomePage;
