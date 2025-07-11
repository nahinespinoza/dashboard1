// ChartUI.tsx
import React from 'react';
import type { Hourly } from '../types/DashboardTypes';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar los componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartUIProps {
  hourly: Hourly | null;
  loading: boolean;
  error: string | null;
}

const ChartUI: React.FC<ChartUIProps> = ({ hourly, loading, error }) => {
  if (loading) return <div>Cargando gráfico...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;
  if (!hourly) return <div>No hay datos para el gráfico.</div>;

  const data = {
    labels: hourly.time,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: hourly.temperature_2m,
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Viento (km/h)',
        data: hourly.wind_speed_10m,
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default ChartUI;
