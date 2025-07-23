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

  const arrLabels = hourly.time;
  const arrValues = (hourly as any)[selectedVariable];

  // Buscar el índice de la hora actual (formato: YYYY-MM-DDTHH:00)
  const now = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const nowISO = `${year}-${month}-${day}T${hour}:00`;

  let start = arrLabels.indexOf(nowISO);
  if (start === -1) start = 0; // Si no encuentra la hora actual, empieza desde el principio

  const end = start + 20;
  const data = {
    labels: arrLabels.slice(start, end),
    datasets: [
      {
        label: VARIABLE_LABELS[selectedVariable] || selectedVariable,
        data: arrValues.slice(start, end),
        borderColor: 'rgba(54,162,235,1)',
        backgroundColor: 'rgba(54,162,235,0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={data} />;
};

export default ChartUI;
