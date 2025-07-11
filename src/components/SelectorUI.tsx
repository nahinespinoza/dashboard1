// SelectorUI.tsx
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface SelectorUIProps {
    city: string;
    onCityChange: (city: string) => void;  // Callback para cambiar la ciudad
}

export default function SelectorUI({ city, onCityChange }: SelectorUIProps) {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onCityChange(event.target.value);  // Notifica al componente padre del cambio
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="city-select-label">Ciudad</InputLabel>
            <Select
                labelId="city-select-label"
                id="city-simple-select"
                label="Ciudad"
                onChange={handleChange}
                value={city}
            >
                <MenuItem disabled value=""><em>Seleccione una ciudad</em></MenuItem>
                <MenuItem value="guayaquil">Guayaquil</MenuItem>
                <MenuItem value="quito">Quito</MenuItem>
                <MenuItem value="manta">Manta</MenuItem>
                <MenuItem value="cuenca">Cuenca</MenuItem>
            </Select>
        </FormControl>
    );
}
