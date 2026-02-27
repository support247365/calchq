/**
 * ZIP Code Router
 * Provides ZIP code data and live weather for programmatic SEO pages
 */
import { z } from "zod";
import { eq } from "drizzle-orm";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { zipCodes } from "../drizzle/schema";

// Fetch live weather from Open-Meteo (free, no API key required)
async function fetchWeather(lat: number, lng: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = await res.json() as {
      current: {
        temperature_2m: number;
        weather_code: number;
        wind_speed_10m: number;
        relative_humidity_2m: number;
      };
    };
    const current = data.current;
    return {
      tempF: Math.round(current.temperature_2m),
      weatherCode: current.weather_code,
      windMph: Math.round(current.wind_speed_10m),
      humidity: Math.round(current.relative_humidity_2m),
      description: getWeatherDescription(current.weather_code),
    };
  } catch {
    return null;
  }
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rainy";
  if (code >= 71 && code <= 75) return "Snowy";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Variable conditions";
}

function getLocalTime(utcOffset: number): string {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const localMs = utcMs + utcOffset * 3600000;
  const local = new Date(localMs);
  return local.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export const zipRouter = router({
  // Get ZIP code data by ZIP code
  getByZip: publicProcedure
    .input(z.object({ zip: z.string().min(5).max(5) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const results = await db
        .select()
        .from(zipCodes)
        .where(eq(zipCodes.zip, input.zip))
        .limit(1);
      if (results.length === 0) return null;
      const zipData = results[0];
      
      // Fetch live weather
      const lat = parseFloat(zipData.lat || '0');
      const lng = parseFloat(zipData.lng || '0');
      const weather = lat && lng ? await fetchWeather(lat, lng) : null;
      
      // Get local time
      const localTime = getLocalTime(zipData.utcOffset || -5);
      
      return {
        ...zipData,
        weather,
        localTime,
      };
    }),

  // Search ZIP codes by city/state for autocomplete
  search: publicProcedure
    .input(z.object({ query: z.string().min(2).max(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      // Simple search by zip prefix or city name
      const isZip = /^\d+$/.test(input.query);
      if (isZip) {
        const results = await db
          .select({ zip: zipCodes.zip, city: zipCodes.city, state: zipCodes.state })
          .from(zipCodes)
          .where(eq(zipCodes.zip, input.query.padEnd(5, '0').slice(0, 5)))
          .limit(10);
        return results;
      }
      return [];
    }),
});
