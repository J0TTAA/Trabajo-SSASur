import React from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const FilterComponent = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel id="cargo-label">Cargo</InputLabel>
        <Select
          labelId="cargo-label"
          value={filters.cargo}
          onChange={(e) => onFilterChange('cargo', e.target.value)}
        >
          <MenuItem value=""><em>Ninguno</em></MenuItem>
          <MenuItem value="Médico Controlador">Médico Controlador</MenuItem>
          <MenuItem value="Enfermero">Enfermero</MenuItem>
          {/* Agregar más opciones según sea necesario */}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="especialidad-label">Especialidad</InputLabel>
        <Select
          labelId="especialidad-label"
          value={filters.especialidad}
          onChange={(e) => onFilterChange('especialidad', e.target.value)}
        >
          <MenuItem value=""><em>Ninguna</em></MenuItem>
          <MenuItem value="Cardiologia">Cardiologia</MenuItem>
          <MenuItem value="Neurocirugia">Neurocirugia</MenuItem>
          <MenuItem value="Endocrinologia">Endocrinologia</MenuItem>
          {/* Agregar más opciones según sea necesario */}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="establecimiento-label">Establecimiento</InputLabel>
        <Select
          labelId="establecimiento-label"
          value={filters.establecimiento}
          onChange={(e) => onFilterChange('establecimiento', e.target.value)}
        >
          <MenuItem value=""><em>Ninguno</em></MenuItem>
          <MenuItem value="Hospital Padre Las Casas">Hospital Padre Las Casas</MenuItem>
          {/* Agregar más opciones según sea necesario */}
        </Select>
      </FormControl>
      <Button variant="contained" color="secondary" onClick={onClearFilters} fullWidth style={{ marginTop: '16px' }}>
        Limpiar Filtros
      </Button>
    </Box>
  );
};

export default FilterComponent;
