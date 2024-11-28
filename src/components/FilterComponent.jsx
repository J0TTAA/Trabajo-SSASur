import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

const FilterComponent = ({ cargo, especialidad, establecimiento, searchQuery, onInputChange, onReset }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Cargo"
          value={cargo}
          name="cargo"
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Especialidad"
          value={especialidad}
          name="especialidad"
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Establecimiento"
          value={establecimiento}
          name="establecimiento"
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          label="Buscar"
          value={searchQuery}
          name="searchQuery"
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button onClick={onReset} variant="contained" color="secondary">
          Resetear Filtros
        </Button>
      </Grid>
    </Grid>
  );
};

export default FilterComponent;
