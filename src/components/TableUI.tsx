import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import DataFetcher from '../functions/DataFetcher';

interface TableUIProps {
  city: string;
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
   {
      field: 'label',
      headerName: 'Label',
      width: 150,
   },
   {
      field: 'value1',
      headerName: 'Value 1',
      width: 150,
   },
   {
      field: 'value2',
      headerName: 'Value 2',
      width: 150,
   },
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

export default function TableUI({ city }: TableUIProps) {
  const { data, loading, error } = DataFetcher(city);

  if (loading) return <div>Cargando datos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No hay datos disponibles.</div>;

  // Usar los datos reales de la API
  const arrLabels = data.hourly.time;
  const arrValues1 = data.hourly.temperature_2m;
  const arrValues2 = data.hourly.wind_speed_10m;
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