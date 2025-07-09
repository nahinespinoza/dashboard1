import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';
import DataFetcher from '../functions/DataFetcher';

interface ChartUIProps {
  city: string;
}

export default function ChartUI({ city }: ChartUIProps) {
  const { data, loading, error } = DataFetcher(city);

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No hay datos disponibles.</div>;

  // Usar los datos reales de la API
  const arrLabels = data.hourly.time;
  const arrValues1 = data.hourly.temperature_2m;
  const arrValues2 = data.hourly.wind_speed_10m;

  // Mostrar solo datos en intervalos (por ejemplo, cada 6 horas)
  const step = 6;
  const filteredLabels = arrValues2.filter((_, idx) => idx % step === 0).map(v => `${v} km/h`); // Etiquetas: velocidad del viento
  const filteredValues1 = arrValues1.filter((_, idx) => idx % step === 0);
  const filteredValues2 = arrValues2.filter((_, idx) => idx % step === 0);

  // Calcular min y max para el eje Y
  const allValues = [...filteredValues1, ...filteredValues2];
  const minY = Math.min(...allValues);
  const maxY = Math.max(...allValues);

  return (
    <>
      <Typography variant="h5" component="div">
        Temperatura y Viento (eje X: velocidad del viento)
      </Typography>
      <LineChart
        height={300}
        series={[
          { data: filteredValues1, label: 'Temperatura (°C)'},
          { data: filteredValues2, label: 'Viento (km/h)'},
        ]}
        xAxis={[{ scaleType: 'point', data: filteredLabels }]}
        yAxis={[{ min: minY, max: maxY }]}
      />
    </>
  );
}