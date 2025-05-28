import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;

const getWeatherIcon = (condition) => {
  if (!condition) return '❓';

  const lowerCaseCondition = condition.toLowerCase();

  if (lowerCaseCondition.includes('clear') || lowerCaseCondition.includes('sun')) {
    return '☀️';
  } else if (lowerCaseCondition.includes('cloud')) {
    return '☁️';
  } else if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
    return '🌧️';
  } else if (lowerCaseCondition.includes('thunderstorm')) {
    return '⛈️';
  } else if (lowerCaseCondition.includes('snow')) {
    return '❄️';
  } else if (lowerCaseCondition.includes('mist') || lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('haze')) {
    return '🌫️';
  } else {
    return '🚫';
  }
};

function App() {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [temps, setTemps] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchWeather() {
      if (!searchCity) return;

      if (!API_KEY) {
        setError('API Key is missing. Please add your OpenWeatherMap API key.');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await axios.get(
          'https://api.openweathermap.org/data/2.5/forecast',
          {
            params: {
              q: searchCity,
              appid: API_KEY,
              units: 'metric',
            },
          }
        );
        const list = res.data.list;
        const dailyData = list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

        const tempsArr = dailyData.map(item => item.main.temp);
        const condArr = dailyData.map(item => item.weather[0].description);
        const datesArr = dailyData.map(item => {
          const date = new Date(item.dt_txt);
          return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        });

        setTemps(tempsArr);
        setConditions(condArr);
        setLabels(datesArr);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setTemps([]);
        setConditions([]);
        setLabels([]);
        if (error.response && error.response.status === 404) {
          setError('City not found. Please check the city name.');
        } else if (error.response && error.response.status === 401) {
          setError('Invalid API Key. Please check your OpenWeatherMap API key.');
        }
        else {
          setError('Error fetching weather data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [searchCity]);

  return (
    <div
      style={{
        background: '#F0F4F8', 
        minHeight: '100vh',
        padding: '50px 20px', 
        color: '#334E68', 
        fontFamily: "'Inter', sans-serif", 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >

      <h1
        style={{
          marginBottom: '40px', 
          fontSize: '2.8em',
          fontWeight: '700', 
          color: '#243B53', 
          animation: 'fadeInDown 0.8s ease-out',
          position: 'relative',
          zIndex: 1,
        }}
      >
        ⛅ Weather Forecast
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '50px',
          width: '100%',
          maxWidth: '400px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setSearchCity(city.trim());
          }}
          style={{
            padding: '15px 20px',
            borderRadius: '8px',
            border: '1px solid #D9E2EC', 
            fontSize: '17px',
            width: '100%',
            boxSizing: 'border-box',
            background: 'white',
            color: '#334E68',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)', 
          }}
        />
        <button
          onClick={() => setSearchCity(city.trim())}
          style={{
            padding: '15px 25px',
            borderRadius: '8px',
            backgroundColor: '#5D9BF8', 
            color: 'white',
            border: 'none',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px',
          }}
        >
          Get Forecast
        </button>
      </div>

      {error && (
        <p
          style={{
            color: '#E06B6B', 
            fontSize: '1em',
            fontWeight: '500',
            marginBottom: '20px',
            animation: 'fadeIn 0.5s ease-out',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {error}
        </p>
      )}
      {loading && (
        <div
          style={{
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderTop: '4px solid #5D9BF8', 
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            animation: 'spin 1s linear infinite',
            margin: '25px auto',
            position: 'relative',
            zIndex: 1,
          }}
        ></div>
      )}

      {temps.length > 0 && !loading && (
        <div
          style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '1200px',
            width: '100%',
            margin: 'auto',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)', 
            border: '1px solid #E0E6EB',
            animation: 'fadeIn 0.8s ease-out',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <h2
            style={{
              width: '100%',
              marginBottom: '25px',
              fontSize: '1.6em',
              fontWeight: '600',
              color: '#243B53',
              letterSpacing: '0.5px',
            }}
          >
            5-Day Forecast for {searchCity}
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
              width: '100%',
            }}
          >
            {labels.map((date, index) => (
              <div
                key={date}
                style={{
                  background: '#F8FBFF', 
                  borderRadius: '10px',
                  padding: '20px',
                  minWidth: '150px',
                  flex: '1 1 auto',
                  textAlign: 'center',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)', 
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  border: '1px solid #E0E6EB',
                  animation: `slideInUp 0.5s ease-out ${index * 0.1}s forwards`, 
                  opacity: 0,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.08)';
                }}
              >
                <p
                  style={{
                    fontSize: '1em',
                    fontWeight: '500',
                    marginBottom: '10px',
                    color: '#627D98', 
                  }}
                >
                  {date}
                </p>
                <p
                  style={{
                    fontSize: '3em',
                    margin: '10px 0',
                  }}
                >
                  {getWeatherIcon(conditions[index])}
                </p>
                <p
                  style={{
                    fontSize: '2.2em',
                    fontWeight: '700',
                    color: '#5D9BF8', 
                  }}
                >
                  {temps[index] ? `${temps[index].toFixed(1)}°C` : 'N/A'}
                </p>
                <p
                  style={{
                    fontSize: '0.9em',
                    opacity: 0.8,
                    color: '#627D98', 
                  }}
                >
                  {conditions[index] || 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;