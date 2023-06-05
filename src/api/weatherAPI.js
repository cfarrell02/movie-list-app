// Local cache for weather data
const weatherDataCache = new Map();

// Local cache for geolocation data
const geoLocationCache = new Map();

export const fetchWeatherData = async (latitude, longitude, timezone = "Europe/London") => {
  try {
    const cacheKey = `${latitude}-${longitude}-${timezone}`;
    // Check if weather data exists in the cache
    if (weatherDataCache.has(cacheKey)) {
      return weatherDataCache.get(cacheKey);
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max`
    );
    const data = await response.json();
    if (response.ok) {
      // Update the cache with the new weather data
      weatherDataCache.set(cacheKey, data);
      return data;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    throw new Error('An error occurred while fetching weather data.');
  }
};

export const fetchGeoLocation = async (location, count = 10) => {
  try {
    // Check if geolocation data exists in the cache
    if (geoLocationCache.has(location)) {
      return geoLocationCache.get(location);
    }

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=${count}&language=en&format=json`
    );
    const data = await response.json();
    if (response.ok) {
      // Update the cache with the new geolocation data
      geoLocationCache.set(location, data);
      return data;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    throw new Error('An error occurred while fetching geo location data.');
  }
};
