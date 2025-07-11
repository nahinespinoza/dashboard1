// TableUI.tsx
import React from 'react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import type { Hourly } from '../types/DashboardTypes';
import { Box } from '@mui/material';

interface TableUIProps {
  hourly: Hourly | null;
  loading: boolean;
  error: string | null;
}

function combineArrays(arrLabels: Array<string>, arrValues1: Array<number>, arrValues2: Array<number>) {
   return arrLabels.map((label, index) => ({
      id: index,
      label: label,
      value1: arrValues1[index],
      value2: arrValues2[index]
   }));
}

const columns: GridColDef[] = [
   { field: 'id', headerName: 'ID', width: 90 },
   { field: 'label', headerName: 'Hora', width: 150 },
   { field: 'value1', headerName: 'Temperatura (°C)', width: 150 },
   { field: 'value2', headerName: 'Viento (km/h)', width: 150 },
   {
      field: 'resumen',
      headerName: 'Resumen',
      description: 'No es posible ordenar u ocultar esta columna.',
      sortable: false,
      hideable: false,
      width: 160,
      valueGetter: (_, row) => `${row.label || ''} ${row.value1 || ''} ${row.value2 || ''}`,
   },
];

const TableUI: React.FC<TableUIProps> = ({ hourly, loading, error }) => {
  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;
  if (!hourly) return <div>No hay datos disponibles.</div>;

  const arrLabels = hourly.time;
  const arrValues1 = hourly.temperature_2m;
  const arrValues2 = hourly.wind_speed_10m;
  const rows = combineArrays(arrLabels, arrValues1, arrValues2);

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
