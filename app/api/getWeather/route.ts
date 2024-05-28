import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';

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

async function getWeatherByCoords(lat: string, lon: string): Promise<WeatherData> {
  try {
    const response: AxiosResponse<WeatherData> = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error(`Not able to fetch weather data: ${error}`);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    const weatherData = await getWeatherByCoords(lat, lon);
    return NextResponse.json(weatherData);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching weather data' }, { status: 500 });
  }
}
