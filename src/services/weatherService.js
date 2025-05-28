import axios from 'axios';

const API_KEY = '979c386ce832478a31899eb2cac46695'; // ← replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city) => {
  const res = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'metric'
    }
  });
  return res.data;
};
