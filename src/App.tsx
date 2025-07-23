import { useState, useEffect } from 'react';
import DataFetcher from './functions/DataFetcher';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import './App.css';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';

// Definir los valores posibles para selectedVariable
type VariableOption = 'temperature_2m' | 'relative_humidity_2m' | 'apparent_temperature' | 'precipitation_probability';

// Opciones para el selector
const VARIABLE_OPTIONS: { value: VariableOption, label: string }[] = [
  { value: 'temperature_2m', label: 'Temperatura (2m)' },
  { value: 'relative_humidity_2m', label: 'Humedad relativa' },
  { value: 'apparent_temperature', label: 'Temperatura aparente' },
  { value: 'precipitation_probability', label: 'Probabilidad de precipitación' },
];

function App() {
  // Estado para manejar el modo oscuro/claro
  const [darkMode, setDarkMode] = useState(false);

  // Función para alternar entre el modo oscuro y claro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Tipado para selectedVariable
  const [selectedVariable, setSelectedVariable] = useState<VariableOption>('temperature_2m'); // Aseguramos que selectedVariable es de tipo VariableOption

  const [city, setCity] = useState('guayaquil');
  const [temperature, setTemperature] = useState<string | null>(null);
  const [apparentTemperature, setApparentTemperature] = useState<string | null>(null);
  const [windSpeed, setWindSpeed] = useState<string | null>(null);
  const [humidity, setHumidity] = useState<string | null>(null);
  const [precipitation, setPrecipitation] = useState<string | null>(null);

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
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      {/* Botón para cambiar el modo */}
      <button onClick={toggleDarkMode} className="toggle-button">
        {/* Usamos un SVG para el sol y luna */}
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="5" fill="yellow" />
            <path d="M12 1V3M12 21V23M21 12H23M1 12H3M17.66 6.34L19.07 7.75M4.93 17.66L6.34 19.07M6.34 6.34L4.93 4.93M17.66 17.66L19.07 19.07" stroke="yellow" strokeWidth="2"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="6" fill="blue" />
            <path d="M12 1V3M12 21V23M21 12H23M1 12H3M17.66 6.34L19.07 7.75M4.93 17.66L6.34 19.07M6.34 6.34L4.93 4.93M17.66 17.66L19.07 19.07" stroke="blue" strokeWidth="2"/>
          </svg>
        )}
      </button>

      {/* Título del Dashboard */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <Grid container spacing={5} justifyContent="center" alignItems="center">
        {/* Indicadores dinámicos */}
        <Grid container size={{ xs: 12, md: 12 }}>
          <Grid size={{ xs: 12, md: 2.4 }}>
            <IndicatorUI
              title="Temperatura (2m)"
              description={
                dataFetcherOutput.loading
                  ? 'Cargando...'
                  : dataFetcherOutput.error
                  ? 'Error'
                  : temperature || 'Datos no disponibles'
              }
              darkMode={darkMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2.4 }}>
            <IndicatorUI
              title="Temperatura aparente"
              description={
                dataFetcherOutput.loading
                  ? 'Cargando...'
                  : dataFetcherOutput.error
                  ? 'Error'
                  : apparentTemperature || 'Datos no disponibles'
              }
              darkMode={darkMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2.4 }}>
            <IndicatorUI
              title="Velocidad del viento"
              description={
                dataFetcherOutput.loading
                  ? 'Cargando...'
                  : dataFetcherOutput.error
                  ? 'Error'
                  : windSpeed || 'Datos no disponibles'
              }
              darkMode={darkMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2.4 }}>
            <IndicatorUI
              title="Humedad relativa"
              description={
                dataFetcherOutput.loading
                  ? 'Cargando...'
                  : dataFetcherOutput.error
                  ? 'Error'
                  : humidity || 'Datos no disponibles'
              }
              darkMode={darkMode}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2.4 }}>
            <IndicatorUI
              title="Probabilidad de precipitación"
              description={
                dataFetcherOutput.loading
                  ? 'Cargando...'
                  : dataFetcherOutput.error
                  ? 'Error'
                  : precipitation || 'Datos no disponibles'
              }
              darkMode={darkMode}
            />
          </Grid>
        </Grid>

        {/* Selector de ciudad */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SelectorUI city={city} onCityChange={setCity} darkMode={darkMode} />
        </Grid>

        {/* Selector de variable */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="variable-select-label" sx={{ color: darkMode ? '#fff' : '#000' }}>Variable</InputLabel>
            <Select
              labelId="variable-select-label"
              id="variable-select"
              value={selectedVariable}
              label="Variable"
              onChange={(e) => setSelectedVariable(e.target.value)}
              sx={{
                backgroundColor: darkMode ? '#333' : '#fff',
                color: darkMode ? '#fff' : '#000',
                '& .MuiSelect-icon': {
                  color: darkMode ? '#fff' : '#000',
                },
              }}
            >
              {VARIABLE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Gráfico */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartUI
            hourly={dataFetcherOutput.data ? dataFetcherOutput.data.hourly : null}
            loading={dataFetcherOutput.loading}
            error={dataFetcherOutput.error}
            selectedVariable={selectedVariable}
            darkMode={darkMode}
          />
        </Grid>

        {/* Tabla */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' }, height: '400px' }}>
          <TableUI
            hourly={dataFetcherOutput.data ? dataFetcherOutput.data.hourly : null}
            loading={dataFetcherOutput.loading}
            error={dataFetcherOutput.error}
            selectedVariable={selectedVariable}
            darkMode={darkMode}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
