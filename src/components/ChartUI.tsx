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
  selectedVariable: string;
}

const VARIABLE_LABELS: Record<string, string> = {
  temperature_2m: 'Temperatura (°C)',
  relative_humidity_2m: 'Humedad relativa (%)',
  apparent_temperature: 'Temperatura aparente (°C)',
  precipitation_probability: 'Probabilidad de precipitación (%)',
};

const ChartUI: React.FC<ChartUIProps> = ({ hourly, loading, error, selectedVariable }) => {
  if (loading) return <div>Cargando gráfico...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;
  if (!hourly) return <div>No hay datos para el gráfico.</div>;

  const data = {
    labels: hourly.time,
    datasets: [
      {
        label: VARIABLE_LABELS[selectedVariable] || selectedVariable,
        data: (hourly as any)[selectedVariable],
        borderColor: 'rgba(54,162,235,1)',
        backgroundColor: 'rgba(54,162,235,0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={data} />;
};

export default ChartUI;
