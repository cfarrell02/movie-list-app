
export const fetchWeatherData = async (latitude,longitude, timezone = "Europe/London") => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset`
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    throw new Error('An error occurred while fetching weather data.');
  }
};

export const fetchGeoLocation = async (location, count = 10) => {
    try{
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=${count}&language=en&format=json`
        );
        const data = await response.json();
        if (response.ok) {
            return data;
        }
        else {
            throw new Error(data.error.message);
        }
    } catch (error) {
        throw new Error('An error occurred while fetching geo location data.');
    }
    }
