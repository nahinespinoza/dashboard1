import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import type { Hourly } from '../types/DashboardTypes';

interface TableUIProps {
  hourly: Hourly | null;
  loading: boolean;
  error: string | null;
  selectedVariable: keyof Hourly;  // Asegúrate de que selectedVariable es una clave válida de Hourly
  darkMode: boolean;
}

const VARIABLE_LABELS: Record<string, string> = {
  temperature_2m: 'Temperatura (°C)',
  relative_humidity_2m: 'Humedad relativa (%)',
  apparent_temperature: 'Temperatura aparente (°C)',
  precipitation_probability: 'Probabilidad de precipitación (%)',
};

const TableUI: React.FC<TableUIProps> = ({ hourly, loading, error, selectedVariable, darkMode }) => {
  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!hourly) return <div>No hay datos disponibles.</div>;

  // Asegúrate de que hourly.time y selectedVariable existen y son arreglos
  const arrLabels = Array.isArray(hourly?.time) ? hourly.time : [];
  const arrValues = Array.isArray(hourly?.[selectedVariable]) ? hourly[selectedVariable] : [];

  // Verifica que arrValues y arrLabels tengan la misma longitud
  if (arrLabels.length !== arrValues.length) {
    return <div>Error en los datos: Las etiquetas y los valores no coinciden.</div>;
  }

  const rows = arrLabels.map((label, index) => ({
    id: index,
    label: label,
    value: arrValues[index],
  }));

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'label', headerName: 'Hora', width: 150, flex: 1 }, // Columna para la hora
    {
      field: 'value',
      headerName: VARIABLE_LABELS[selectedVariable] || selectedVariable,
      flex: 2, // Esta columna ocupará el doble de espacio
      minWidth: 200, // Asegúrate de que tenga un ancho mínimo
    },
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
        sx={{
          backgroundColor: darkMode ? '#333' : '#fff',
          color: darkMode ? '#fff' : '#000',
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: darkMode ? '#444' : '#f4f4f9',
            color: darkMode ? '#fff' : '#000',
          },
          '& .MuiDataGrid-row': {
            backgroundColor: darkMode ? '#444' : '#fff',
            '&:hover': {
              backgroundColor: darkMode ? '#555' : '#f0f0f0',
            },
          },
          '& .MuiDataGrid-cell': {
            borderBottom: darkMode ? '1px solid #555' : '1px solid #ddd',
          },
        }}
      />
    </Box>
  );
};

export default TableUI;
