import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

interface IndicatorUIProps {
  title?: string;
  description?: string;
  darkMode: boolean;
}

export default function IndicatorUI(props: IndicatorUIProps) {
  return (
    <Card sx={{ 
      backgroundColor: props.darkMode ? '#333' : '#fff', 
      color: props.darkMode ? '#fff' : '#000' // Cambiar el color del texto según el tema
    }}>
      <CardContent sx={{ height: '100%' }}>
        <Typography variant="h5" component="div" sx={{ color: props.darkMode ? '#fff' : '#000' }}>
          {props.description}
        </Typography>
        <Typography variant="body2" component="p" color="text.secondary" sx={{ color: props.darkMode ? '#bbb' : '#555' }}>
          {props.title}
        </Typography>
      </CardContent>
    </Card>
  );
}
