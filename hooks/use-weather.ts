"use client";

import { SITE_OPTIONS } from "@/constants/options";
import { useState, useEffect } from "react";

type WeatherResponse = {
  temperature: number;
  wind_speed: number;
  wind_direction: number;
  wind_direction_text: string;
  condition_text: string;
  date: string;
  timezone: string;
};

const getWeatherCondition = (temperature: number, windSpeed: number): string => {
  if (temperature > 30) return "Hot & Sunny";
  if (temperature > 20 && windSpeed < 15) return "Sunny";
  if (temperature > 20 && windSpeed >= 15) return "Windy & Warm";
  if (temperature < 10) return "Cold & Cloudy";
  if (windSpeed > 30) return "Very Windy";
  return "Mild & Cloudy";
};

const getWindDirectionText = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(degrees / 45) % 8];
};

export function useWeather(siteId: string, date: string) {
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId || !date) return;

    const selectedSite = SITE_OPTIONS.find((site) => site.id === siteId);
    if (!selectedSite) {
      setError("Invalid site selected");
      return;
    }

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedSite.lat}&longitude=${selectedSite.lon}&daily=temperature_2m_max,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto&start_date=${date}&end_date=${date}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await res.json();

        if (!data?.daily?.time?.length) {
          throw new Error("No weather data available for this date.");
        }

        const temperature = data.daily.temperature_2m_max[0];
        const wind_speed = data.daily.wind_speed_10m_max[0];
        const wind_direction = data.daily.wind_direction_10m_dominant[0];

        setWeatherData({
          temperature,
          wind_speed,
          wind_direction,
          wind_direction_text: getWindDirectionText(wind_direction),
          condition_text: getWeatherCondition(temperature, wind_speed),
          date: data.daily.time[0],
          timezone: data.timezone,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [siteId, date]);

  return { weatherData, loading, error };
}
