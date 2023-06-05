import React, { createContext, useEffect, useState } from 'react';

// Create the Weather Context
export const WeatherContext = createContext(null);

const WeatherProvider = ({ children }) => {
  const [weatherDetails, setWeatherDetails] = useState([]);
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    // Load weather details from sessionStorage on component mount
    const storedWeatherDetails = sessionStorage.getItem('weatherDetails');
    if (storedWeatherDetails) {
      setWeatherDetails(JSON.parse(storedWeatherDetails));
    }
    setIsInitialised(true); // Set isInitialised to true
  }, []);

  // Function to update the weather details array
  const updateWeatherDetails = (newDetails) => {
    setWeatherDetails(newDetails);
    // Store updated weather details in sessionStorage
    console.log(newDetails)
    sessionStorage.setItem('weatherDetails', JSON.stringify(newDetails));
  };

  // Value object to be provided by the Weather Context
  const weatherContextValue = {
    weatherDetails,
    updateWeatherDetails,
    isInitialised,
  };

  return (
    <WeatherContext.Provider value={weatherContextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherProvider;
