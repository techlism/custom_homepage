'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Separator } from './ui/separator';

interface Weather {
  description: string;
}

interface Main {
  temp: number;
}

interface WeatherData {
  weather: Weather[];
  main: Main;
}

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`/api/getWeather?lat=${latitude}&lon=${longitude}`);
          setWeatherData(response.data);
        } catch (error) {
          setError('Error fetching weather data');
        }
      }, (error) => {
        setError('Geolocation permission denied');
      });
    } else {
      setError('Geolocation is not supported by this browser');
    }
  }, []);

  if (error) {
    return <div className='p-2 border rounded-md font-semibold text-red-500'>{error}</div>;
  }

  if (!weatherData) {
    return <div className='p-2 border rounded-md font-semibold'>Loading...</div>;
  }

  return (
    <div className="rounded-md hover:shadow-sm transform ease-in-out transition-all w-[90%]">
      <div className='border rounded-md bg-card p-2'>
        <p className='font-semibold text-xl'>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
        <Separator className='my-2'/>
        <div className='flex gap-4 text-lg font-medium'>
            <p>{(weatherData.main.temp - 273.15).toPrecision(3)}°C</p>
            <div className='w-[2px] min-h-2 bg-secondary'></div>
            <p>{weatherData.weather[0]?.description.split(' ').map((line: string) => (
            `${line[0].toUpperCase()}${line.slice(1)} `
            )).join(' ')}</p>            
        </div>

      </div>
    </div>
  );
};

export default WeatherWidget; 