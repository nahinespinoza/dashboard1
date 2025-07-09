// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import './App.css'
import { Grid } from '@mui/material';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';


function App() {

   return (
      <Grid container spacing={5} justifyContent="center" alignItems="center">
         {/* Selector */}
         <Grid size={{xs:12, md:3 }}>
            <SelectorUI />
         </Grid>

         {/* Encabezado */}
         <Grid size={{xs:12, md:12}} >Elemento: Encabezado</Grid>

         {/* Alertas */}
         <Grid size={{xs:12, md:12}}>Elemento: Alertas</Grid>

         {/* Selector */}
         <Grid size={{xs:12, md:3 }}>Elemento: Selector</Grid>

         {/* Indicadores */}
         <Grid container size={{ xs: 12, md: 9 }} >

            <Grid size={{ xs: 12, md: 3 }}>
               <IndicatorUI title='Temperatura (2m)' description='XX°C' />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
               <IndicatorUI title='Temperatura aparente' description='YY°C' />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
               <IndicatorUI title='Velocidad del viento' description='ZZkm/h' />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
               <IndicatorUI title='Humedad relativa' description='NN%' />
            </Grid>

         </Grid>
         {/* Gráfico */}
         <Grid size={{xs:12, md:6 }}><ChartUI /></Grid>

         {/* Tabla */}
         <Grid size={{xs:12, md:6 }} sx={{ display: { xs: "none", md: "block" } }}><TableUI /></Grid>

         {/* Información adicional */}
         <Grid size={{xs:12, md:12}}>Elemento: Información adicional</Grid>

      </Grid>
   );
}

export default App;