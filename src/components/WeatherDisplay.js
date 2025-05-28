import React from 'react';

const WeatherDisplay = ({ weather }) => (
  <div>
    <h2>{weather.name}</h2>
    <p>{weather.main.temp}°C - {weather.weather[0].description}</p>
  </div>
);

export default WeatherDisplay;
