// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import './App.css'
import { Grid } from '@mui/material';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import DataFetcher from './functions/DataFetcher';

import { useState } from 'react';

function App() {
   const [city, setCity] = useState('');
   const { data, loading, error } = DataFetcher(city);

   return (
      <Grid container spacing={5} justifyContent="center" alignItems="center">
         {/* Selector */}
         <Grid size={{xs:12, md:3 }}>
            <SelectorUI city={city} onCityChange={setCity} />
         </Grid>

         {/* Información meteorológica seleccionada */}
         <Grid size={{xs:12, md:9}}>
            {city && (
               <div style={{marginTop: 12}}>
                  <p>
                     Información del clima en <span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{city}</span>
                  </p>
                  {loading && <p>Cargando datos...</p>}
                  {error && <p style={{color: 'red'}}>Error: {error}</p>}
                  {data && (
                     <ul style={{margin: 0, paddingLeft: 18}}>
                        <li>Temperatura (2m): {data.hourly.temperature_2m[0]} °C</li>
                        <li>Temperatura aparente: {data.hourly.apparent_temperature[0]} °C</li>
                        <li>Viento: {data.hourly.wind_speed_10m[0]} km/h</li>
                        <li>Humedad relativa: {data.hourly.relative_humidity_2m[0]} %</li>
                     </ul>
                  )}
               </div>
            )}
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
         <Grid size={{xs:12, md:6 }}><ChartUI city={city} /></Grid>

         {/* Tabla */}
         <Grid size={{xs:12, md:6 }} sx={{ display: { xs: "none", md: "block" } }}><TableUI city={city} /></Grid>

         {/* Información adicional */}
         <Grid size={{xs:12, md:12}}>Elemento: Información adicional</Grid>

      </Grid>
   );
}

export default App;