import React, { useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, TextField, Button, Box, Tab, Tabs } from '@mui/material';
import { fetchGeoLocation, fetchWeatherData } from '../../api/weatherAPI';
import { formateName } from '../../utils';
import LocationCard from '../locationCard';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { WeatherContext } from '../../contexts/weatherContext';

const LocationSearch = ({ title }) => {
  const [location, setLocation] = useState({});
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [fetchingData, setFetchingData] = useState(false); // New state for fetching data
  const [tabValue, setTabValue] = useState(0); // State for controlling active tab
  const { weatherDetails, updateWeatherDetails, isInitialised } = useContext(WeatherContext);

  const maxHours = 48;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    
    weatherDetails.forEach( (location) => {
      console.log(weatherData)
      console.log(location);
      fetchWeather(location);
    });
  }, [isInitialised]);

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
      const data = await fetchWeatherData(coords.latitude, coords.longitude, coords.timezone);
      setOptions([]);
      const currentTime = new Date();
      let hourlyData = [];
      for (let i = 0; i < maxHours; i++) {
        let currentDate =
          currentTime.getDate() === parseInt(data.hourly.time[i].substring(8, 10)) &&
          currentTime.toTimeString().substring(0, 2) === data.hourly.time[i].substring(11, 13);
        hourlyData.push({
          time: new Date(data.hourly.time[i]),
          temperature: data.hourly.temperature_2m[i],
          description: data.hourly.weathercode[i],
          precipitationProbability: data.hourly.precipitation_probability[i],
          isCurrent: currentDate,
        });
      }
      data.hourly = hourlyData;
      let dailyData = [];
      for (let i = 0; i < data.daily.time.length; i++) {
        dailyData.push({
          time: new Date(data.daily.time[i]),
          temperature_2m_max: data.daily.temperature_2m_max[i],
          temperature_2m_min: data.daily.temperature_2m_min[i],
          description: data.daily.weathercode[i],
          sunrise: new Date(data.daily.sunrise[i]),
          sunset: new Date(data.daily.sunset[i]),
          precipitationProbability: data.daily.precipitation_probability_max[i],
        });
      }
      data.daily = dailyData;
      const newData = { coords: coords, data };
    setWeatherData((prevData) => [...prevData, { coords: coords, data }]); // Use functional form of setWeatherData
    setTabValue(weatherData.length); // Set active tab to the newly added location

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
      try{
      const searchObject = (await fetchLocations(event.target.value))[0];
      updateWeatherDetails([...weatherDetails, searchObject]);
      fetchWeather(searchObject);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAutocompleteChange = (event, value) => {
    if (value) {
      setLocation(value);
      updateWeatherDetails([...weatherDetails, value]);
      fetchWeather(value);
    }
  };

  const removeLocation = (index) => {
    let newWeatherData = [...weatherData];
    newWeatherData.splice(index, 1);
    setWeatherData(newWeatherData);
    updateWeatherDetails(weatherDetails.filter((location, i) => i !== index));
    setTabValue(0);
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
          getOptionLabel={(option) => formateName(option)}
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

        {error && (
          <Typography variant="body1" color="error" sx={{ marginTop: '1rem' }}>
            {error}
          </Typography>
        )}

        <Box sx={{ marginTop: '1rem' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered scrollButtons="auto">
            {weatherData.map((data, index) => (
              <Tab key={index} label={data.coords.name} />
            ))}
          </Tabs>

          {weatherData.map((data, index) => (
            <div key={index} hidden={tabValue !== index}>
              <LocationCard weatherObject={data}
                            removeFunction={() => removeLocation(index)}
                            />
            </div>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LocationSearch;
