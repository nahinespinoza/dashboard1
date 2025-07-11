import { useState, useEffect } from 'react';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import './App.css';
import { Grid } from '@mui/material';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';

function App() {
    const [city, setCity] = useState('guayaquil'); // Valor por defecto
    const [temperature, setTemperature] = useState<string | null>(null);
    const [apparentTemperature, setApparentTemperature] = useState<string | null>(null);
    const [windSpeed, setWindSpeed] = useState<string | null>(null);
    const [humidity, setHumidity] = useState<string | null>(null);

    // Traer los datos de la API
    const dataFetcherOutput = DataFetcher(city);

    // Actualizar los indicadores cuando los datos estén disponibles
    useEffect(() => {
        if (dataFetcherOutput.data && dataFetcherOutput.data.hourly) {
            const hourlyData = dataFetcherOutput.data.hourly;
            const units = dataFetcherOutput.data.hourly_units || {};
            setTemperature(`${hourlyData.temperature_2m[0]} ${units.temperature_2m || '°C'}`);
            setApparentTemperature(`${hourlyData.apparent_temperature[0]} ${units.apparent_temperature || '°C'}`);
            setWindSpeed(`${hourlyData.wind_speed_10m[0]} ${units.wind_speed_10m || 'km/h'}`);
            setHumidity(`${hourlyData.relative_humidity_2m[0]} ${units.relative_humidity_2m || '%'}`);
        } else {
            setTemperature(null);
            setApparentTemperature(null);
            setWindSpeed(null);
            setHumidity(null);
        }
    }, [dataFetcherOutput.data]);

    return (
        <Grid container spacing={5} justifyContent="center" alignItems="center">
            {/* Selector */}
            <Grid size={{ xs: 12, md: 3 }}>
                <SelectorUI city={city} onCityChange={setCity} />
            </Grid>

            {/* Indicadores dinámicos */}
            <Grid container size={{ xs: 12, md: 9 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <IndicatorUI
                        title="Temperatura (2m)"
                        description={
                            dataFetcherOutput.loading
                                ? 'Cargando...'
                                : dataFetcherOutput.error
                                ? 'Error'
                                : temperature || 'Datos no disponibles'
                        }
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <IndicatorUI
                        title="Temperatura aparente"
                        description={
                            dataFetcherOutput.loading
                                ? 'Cargando...'
                                : dataFetcherOutput.error
                                ? 'Error'
                                : apparentTemperature || 'Datos no disponibles'
                        }
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <IndicatorUI
                        title="Velocidad del viento"
                        description={
                            dataFetcherOutput.loading
                                ? 'Cargando...'
                                : dataFetcherOutput.error
                                ? 'Error'
                                : windSpeed || 'Datos no disponibles'
                        }
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <IndicatorUI
                        title="Humedad relativa"
                        description={
                            dataFetcherOutput.loading
                                ? 'Cargando...'
                                : dataFetcherOutput.error
                                ? 'Error'
                                : humidity || 'Datos no disponibles'
                        }
                    />
                </Grid>
            </Grid>

            {/* Alertas */}
            <Grid size={{ xs: 12, md: 12 }}>Elemento: Alertas</Grid>

            {/* Gráfico */}
            <Grid size={{ xs: 12, md: 6 }}>
                <ChartUI
                    hourly={dataFetcherOutput.data ? dataFetcherOutput.data.hourly : null}
                    loading={dataFetcherOutput.loading}
                    error={dataFetcherOutput.error}
                />
            </Grid>

            {/* Tabla */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' }, height: '400px' }}>
                <TableUI
                    hourly={dataFetcherOutput.data ? dataFetcherOutput.data.hourly : null}
                    loading={dataFetcherOutput.loading}
                    error={dataFetcherOutput.error}
                />
            </Grid>

            {/* Información adicional */}
            <Grid size={{ xs: 12, md: 12 }}>Elemento: Información adicional</Grid>
        </Grid>
    );
}

export default App;