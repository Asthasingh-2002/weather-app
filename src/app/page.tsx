"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "@/components/Navbar";
import { format, parseISO } from 'date-fns';

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<{ list: WeatherDetail[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=pune&cnt=56`,
          {
            params: {
              q: 'pune',
              appid: process.env.NEXT_PUBLIC_WEATHER_KEY,
            },
          }
        );
        setWeatherData(response.data);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const firstData = weatherData?.list ? weatherData.list[0] : null;

  if (loading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* today's data */}
        <section className="space-y-4">
          <div className="space-y-2">
            <h2 className="flex gap-1 text-2xl items-end">
              <p>
                {firstData?.dt_txt
                  ? format(parseISO(firstData.dt_txt), "EEEE")
                  : "Loading..."}
              </p>
              <p className="text-lg">
                {firstData?.dt_txt
                  ? `(${format(parseISO(firstData.dt_txt), "dd.MM.yyyy")})`
                  : ""}
              </p>
            </h2>
          </div>
        </section>
        {/* 7-day forecast data */}
        <section></section>
      </main>
    </div>
  );
}
