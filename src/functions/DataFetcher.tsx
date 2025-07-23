// DataFetcher.tsx
import { useEffect, useState } from 'react';
import type { RootInterface } from '../types/DashboardTypes';
const CACHE_KEY_PREFIX = 'weather_data_';
const CACHE_DURATION_MINUTES = 1;

function isCacheValid(timestamp: number) {
    const now = Date.now();
    const ageMinutes = (now - timestamp) / (1000 * 60);
    return ageMinutes < CACHE_DURATION_MINUTES;
}


const cityCoords: Record<string, { lat: number; lon: number; timezone: string }> = {
    guayaquil: { lat: -2.1962, lon: -79.8862, timezone: 'America/Guayaquil' },
    quito: { lat: -0.1807, lon: -78.4678, timezone: 'America/Guayaquil' },
    manta: { lat: -0.9677, lon: -80.7089, timezone: 'America/Guayaquil' },
    cuenca: { lat: -2.9006, lon: -79.0045, timezone: 'America/Guayaquil' },
};

export default function DataFetcher(city: string) {
    const [data, setData] = useState<RootInterface | null>(null);
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=${timezone}`
    // const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,apparent_temperature,wind_speed_10m,temperature_2m&timezone=${timezone}`;
    const cacheKey = `${CACHE_KEY_PREFIX}${city}`;

    const fetchData = async () => {
        try {
            // Intenta leer del localStorage
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (isCacheValid(parsed.timestamp)) {
                    setData(parsed.data);
                    setLoading(false);
                    return;
                }
            }

            // Si no hay cache o es inválido, hacer fetch
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            const result: RootInterface = await response.json();
            setData(result);

            // Guardar en cache con timestamp
            localStorage.setItem(cacheKey, JSON.stringify({
                data: result,
                timestamp: Date.now()
            }));
        } catch (err: any) {
            console.error('Fallo en la obtención de datos:', err);

            // Si falla, intenta usar el caché viejo si existe
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                setData(parsed.data);
                setError("Mostrando datos almacenados por error en la conexión.");
            } else {
                setError("No se pudieron obtener los datos.");
            }
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [city]);


    return { data, loading, error };
}
