import React from 'react';
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
  hourly: any;
  loading: boolean;
  error: string | null;
  selectedVariable: string;
  darkMode: boolean;
}

const VARIABLE_LABELS: Record<string, string> = {
  temperature_2m: 'Temperatura (°C)',
  relative_humidity_2m: 'Humedad relativa (%)',
  apparent_temperature: 'Temperatura aparente (°C)',
  precipitation_probability: 'Probabilidad de precipitación (%)',
};

const ChartUI: React.FC<ChartUIProps> = ({ hourly, loading, error, selectedVariable, darkMode }) => {
  if (loading) return <div style={{ color: darkMode ? '#fff' : '#000' }}>Cargando gráfico...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!hourly) return <div>No hay datos para el gráfico.</div>;

  const arrLabels = hourly.time;
  const arrValues = hourly[selectedVariable]; // Obtener los valores de la variable seleccionada

  const now = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : n);
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const nowISO = `${year}-${month}-${day}T${hour}:00`;

  let start = arrLabels.indexOf(nowISO);
  if (start === -1) start = 0; // Si no encuentra la hora actual, empieza desde el principio

  const end = start + 20; // Mostrar las siguientes 20 horas
  const data = {
    labels: arrLabels.slice(start, end),
    datasets: [
      {
        label: VARIABLE_LABELS[selectedVariable] || selectedVariable,
        data: arrValues.slice(start, end), 
        borderColor: darkMode ? 'rgba(255,99,132,1)' : 'rgba(54,162,235,1)',  
        backgroundColor: darkMode ? 'rgba(255,99,132,0.2)' : 'rgba(54,162,235,0.2)', 
        fill: true,
      },
    ],
  };

  return <Line data={data} />;
};

export default ChartUI;
