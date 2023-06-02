import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { fetchGeoLocation, fetchWeatherData } from '../../api/weatherAPI';
import { weatherCodeTranslator } from '../../utils';
import LocationCard from '../locationCard';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

const LocationSearch = ({ title }) => {
  const [location, setLocation] = useState({});
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [fetchingData, setFetchingData] = useState(false); // New state for fetching data
  const maxHours = 48;

  const fetchLocations = async (location) => {
    try {
      setFetchingData(true); // Start fetching data
      const data = (await fetchGeoLocation(location)).results;
      return data;
    } catch (error) {
      throw new Error('An error occurred while fetching geo location data.');
    } finally { 
        setFetchingData(false); // Stop fetching data
    }
  };

  const fetchWeather = async (coords) => {
    try {
      setFetchingData(true); // Start fetching data
      const data = await fetchWeatherData(coords.latitude, coords.longitude);
      setOptions([]);
      const currentTime = new Date();
      let hourlyData = [];
      for (let i = 0; i < maxHours; i++) {
        let currentDate =
          currentTime.getDate() === parseInt(data.hourly.time[i].substring(8, 10)) &&
          currentTime.toTimeString().substring(0, 2) === data.hourly.time[i].substring(11, 13);
        hourlyData.push({
          time: data.hourly.time[i],
          temperature: data.hourly.temperature_2m[i],
          description: data.hourly.weathercode[i],
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
    } finally {
      setFetchingData(false); // Stop fetching data
    }
  };

  const handleTextFieldChange = async (event) => {
    let data = await fetchLocations(event.target.value);
    if (data) {
      setOptions(data);
    } else {
      setOptions([]);
    }
  };

  const handleSearch = async (event) => {
    if (event.target.value) {
      const searchObject = (await fetchLocations(event.target.value))[0];
      fetchWeather(searchObject);
    }
  };

  const handleAutocompleteChange = (event, value) => {
    if (value) {
      setLocation(value);
      fetchWeather(value);
    }
  };

  return (
    <Card variant="outlined" sx={{ margin: '2%' }}>
      <CardContent>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {title}
        </Typography>

        <Autocomplete
          onChange={handleAutocompleteChange}
          sx={{ width: '100%' }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name + ', ' + option.country}
          options={options}
          loading={fetchingData} // Use the fetchingData state as the loading value
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Location"
              onChange={handleTextFieldChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSearch(event);
                }
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {fetchingData ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              fullWidth
            />
          )}
        />
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
