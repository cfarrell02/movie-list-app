import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import WeatherCard from '../../components/weatherCard';
import { fetchWeatherData } from '../../api/weatherAPI';

function HomePage() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    try {
      const data = await fetchWeatherData(location);
      setWeatherData(prevData => [...prevData, data]);
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
          location={`${data.location.name}, ${data.location.country}`}
          temperature={data.current.temp_c}
          description={data.current.condition.text}
          humidity={data.current.humidity}
        />
        ))
      )}
    </Container>
  );
}

export default HomePage;
