export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: Hourlyunits;
  hourly: Hourly;
}

export interface Hourly {
  time: string[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  wind_speed_10m: number[];
  temperature_2m: number[];
}

export interface Hourlyunits {
  time: string;
  relative_humidity_2m: string;
  apparent_temperature: string;
  wind_speed_10m: string;
  temperature_2m: string;
}