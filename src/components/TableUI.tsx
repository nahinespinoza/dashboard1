// TableUI.tsx
import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { Hourly } from '../types/DashboardTypes';
import { Box } from '@mui/material';

interface TableUIProps {
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

const TableUI: React.FC<TableUIProps> = ({ hourly, loading, error, selectedVariable }) => {
  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;
  if (!hourly) return <div>No hay datos disponibles.</div>;

  const arrLabels = hourly.time;
  const arrValues = (hourly as any)[selectedVariable];

  const rows = arrLabels.map((label, index) => ({
    id: index,
    label: label,
    value: arrValues[index],
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'label', headerName: 'Hora', width: 150 },
    { field: 'value', headerName: VARIABLE_LABELS[selectedVariable] || selectedVariable, width: 200 },
  ];

  return (
    <Box sx={{ height: 350, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default TableUI;
