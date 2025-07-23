import { useState, useEffect } from 'react';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import './App.css';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';

const VARIABLE_OPTIONS = [
    { value: 'temperature_2m', label: 'Temperatura (2m)' },
    { value: 'relative_humidity_2m', label: 'Humedad relativa' },
    { value: 'apparent_temperature', label: 'Temperatura aparente' },
    { value: 'precipitation_probability', label: 'Probabilidad de precipitación' },
];

function App() {
    const [city, setCity] = useState('guayaquil');
    const [temperature, setTemperature] = useState<string | null>(null);
    const [apparentTemperature, setApparentTemperature] = useState<string | null>(null);
    const [windSpeed, setWindSpeed] = useState<string | null>(null);
    const [humidity, setHumidity] = useState<string | null>(null);
    const [precipitation, setPrecipitation] = useState<string | null>(null);

    // Nuevo estado para la variable seleccionada
    const [selectedVariable, setSelectedVariable] = useState('temperature_2m');

    const dataFetcherOutput = DataFetcher(city);

    useEffect(() => {
        if (dataFetcherOutput.data && dataFetcherOutput.data.hourly) {
            const hourlyData = dataFetcherOutput.data.hourly;
            const units = dataFetcherOutput.data.hourly_units || {};
            const times = hourlyData.time;

            if (!times || !times.length) {
                setTemperature(null);
                setApparentTemperature(null);
                setWindSpeed(null);
                setHumidity(null);
                setPrecipitation(null);
                return;
            }

            const now = new Date();
            const pad = (n: number) => (n < 10 ? '0' + n : n);
            const year = now.getFullYear();
            const month = pad(now.getMonth() + 1);
            const day = pad(now.getDate());
            const hour = pad(now.getHours());
            const nowISO = `${year}-${month}-${day}T${hour}:00`;
            const index = times.indexOf(nowISO);

            const idx = index === -1 ? 0 : index;

            setTemperature(hourlyData.temperature_2m?.[idx] != null ? `${hourlyData.temperature_2m[idx]} ${units.temperature_2m || '°C'}` : null);
            setApparentTemperature(hourlyData.apparent_temperature?.[idx] != null ? `${hourlyData.apparent_temperature[idx]} ${units.apparent_temperature || '°C'}` : null);
            setWindSpeed(hourlyData.wind_speed_10m?.[idx] != null ? `${hourlyData.wind_speed_10m[idx]} ${units.wind_speed_10m || 'km/h'}` : null);
            setHumidity(hourlyData.relative_humidity_2m?.[idx] != null ? `${hourlyData.relative_humidity_2m[idx]} ${units.relative_humidity_2m || '%'}` : null);
            setPrecipitation(hourlyData.precipitation_probability?.[idx] != null ? `${hourlyData.precipitation_probability[idx]} ${units.precipitation_probability || '%'}` : null);
        } else {
            setTemperature(null);
            setApparentTemperature(null);
            setWindSpeed(null);
            setHumidity(null);
            setPrecipitation(null);
        }
    }, [dataFetcherOutput.data]);

    return (
        
        <Grid container spacing={5} justifyContent="center" alignItems="center">

            {/* Indicadores dinámicos */}
            <Grid container size = {{xs : 12, md:12}}>
                <Grid  size = {{xs : 12, md:2.4}}>
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
                <Grid  size = {{xs : 12, md:2.4}}>
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
                <Grid  size = {{xs : 12, md:2.4}}>
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
                <Grid  size = {{xs : 12, md:2.4}}>
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
                <Grid  size = {{xs : 12, md:2.4}}>
                    <IndicatorUI
                        title="Probabilidad de precipitación"
                        description={
                            dataFetcherOutput.loading
                                ? 'Cargando...'
                                : dataFetcherOutput.error
                                ? 'Error'
                                : precipitation || 'Datos no disponibles'
                        }
                    />
                </Grid>
            </Grid>
            
            {/* Selector de ciudad */}
            <Grid  size = {{xs : 12, md:6}}>
                <SelectorUI city={city} onCityChange={setCity} />
            </Grid>

            {/* Selector de variable */}
            <Grid size = {{xs : 12, md:6}}>
                <FormControl fullWidth>
                    <InputLabel id="variable-select-label">Variable</InputLabel>
                    <Select
                        labelId="variable-select-label"
                        id="variable-select"
                        value={selectedVariable}
                        label="Variable"
                        onChange={e => setSelectedVariable(e.target.value)}
                    >
                        {VARIABLE_OPTIONS.map(opt => (
                            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>



            {/* Gráfico */}
            <Grid  size = {{xs : 12, md:6}}>
                <ChartUI
                    hourly={dataFetcherOutput.data ? dataFetcherOutput.data.hourly : null}
                    loading={dataFetcherOutput.loading}
                    error={dataFetcherOutput.error}
                    selectedVariable={selectedVariable}
                />
            </Grid>

            {/* Tabla */}
            <Grid  size = {{xs : 12, md:6}} sx={{ display: { xs: 'none', md: 'block' }, height: '400px' }}>
                <TableUI
                    hourly={dataFetcherOutput.data ? dataFetcherOutput.data.hourly : null}
                    loading={dataFetcherOutput.loading}
                    error={dataFetcherOutput.error}
                    selectedVariable={selectedVariable}
                />
            </Grid>

            {/* Información adicional */}
            <Grid  size = {{xs : 12, md:12}}>Elemento: Información adicional</Grid>
        </Grid>
    );
}

export default App;