const API_KEY = 'a17e9e547f7b4ba2bb7193541233005';

export const fetchWeatherData = async (location) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}`
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
