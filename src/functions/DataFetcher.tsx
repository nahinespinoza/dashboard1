import { useEffect, useState } from 'react';
import type { OpenMeteoResponse } from '../types/DashboardTypes';

interface DataFetcherOutput {
    data: OpenMeteoResponse | null;
    loading: boolean;
    error: string | null;
}

const cityCoords: Record<string, { lat: number; lon: number; timezone: string }> = {
    guayaquil: { lat: -2.1962, lon: -79.8862, timezone: 'America/Guayaquil' },
    quito: { lat: -0.1807, lon: -78.4678, timezone: 'America/Guayaquil' },
    manta: { lat: -0.9677, lon: -80.7089, timezone: 'America/Guayaquil' },
    cuenca: { lat: -2.9006, lon: -79.0045, timezone: 'America/Guayaquil' },
};

export default function DataFetcher(city: string): DataFetcherOutput {
    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city || !cityCoords[city]) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        const { lat, lon, timezone } = cityCoords[city];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,apparent_temperature,wind_speed_10m,temperature_2m&timezone=${timezone}`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
                }
                const result: OpenMeteoResponse = await response.json();
                setData(result);
            } catch (err: any) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error desconocido al obtener los datos.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [city]);

    return { data, loading, error };
}