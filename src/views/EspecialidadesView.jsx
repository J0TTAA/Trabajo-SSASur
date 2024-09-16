import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, MenuItem, Card, CardContent } from '@mui/material';

const EspecialidadesView = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [selectedUbicacion, setSelectedUbicacion] = useState('');
  const [ubicacionInfo, setUbicacionInfo] = useState(null);

  useEffect(() => {
    const fetchEspecialidades = () => {
      const especialidades = ['Ginecologia', 'Cardiología Adulto', 'BroncoPulmonar Infantil', 'Otorrinolaringologia'];
      setEspecialidades(especialidades);
    };

    const fetchUbicaciones = () => {
      const ubicaciones = ['Hospital Clínico', 'Centro de Salud Norte', 'Hospital Central', 'Clínica San José'];
      setUbicaciones(ubicaciones);
    };

    fetchEspecialidades();
    fetchUbicaciones();
  }, []);

  const handleEspecialidadChange = (event) => {
    const especialidadSeleccionada = event.target.value;
    setSelectedEspecialidad(especialidadSeleccionada);
    setSelectedUbicacion('');
    setUbicacionInfo(null);

    // Aquí puedes filtrar ubicaciones según la especialidad seleccionada
    if (especialidadSeleccionada === 'Ginecologia') {
      setUbicacionInfo({
        ubicacion: 'Hospital Clínico',
        detalles: 'Hospital Clínico especializado en Ginecología.'
      });
    } else {
      setUbicacionInfo(null);
    }
  };

  const handleUbicacionChange = (event) => {
    const ubicacionSeleccionada = event.target.value;
    setSelectedUbicacion(ubicacionSeleccionada);
    setSelectedEspecialidad('');
    setUbicacionInfo(null);

    // Aquí puedes filtrar especialidades según la ubicación seleccionada
    if (ubicacionSeleccionada === 'Hospital Clínico') {
      setUbicacionInfo({
        especialidad: 'Ginecologia',
        detalles: 'Ginecología en Hospital Clínico.'
      });
    } else {
      setUbicacionInfo(null);
    }
  };

  return (
    <div>
      <Box p={2} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="body2" color="textSecondary">
          Inicio &gt; Búsqueda de Especialidades &gt; Por Ubicación
        </Typography>

        <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Especialidad"
              fullWidth
              variant="outlined"
              value={selectedEspecialidad}
              onChange={handleEspecialidadChange}
            >
              {especialidades.map((especialidad, index) => (
                <MenuItem key={index} value={especialidad}>
                  {especialidad}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Ubicación"
              fullWidth
              variant="outlined"
              value={selectedUbicacion}
              onChange={handleUbicacionChange}
            >
              {ubicaciones.map((ubicacion, index) => (
                <MenuItem key={index} value={ubicacion}>
                  {ubicacion}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {ubicacionInfo && (
          <Grid container spacing={2} style={{ marginTop: '16px' }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  {selectedEspecialidad && (
                    <>
                      <Typography variant="h6">
                        Ubicación para {selectedEspecialidad}
                      </Typography>
                      <Typography variant="body1">
                        {ubicacionInfo.ubicacion} - {ubicacionInfo.detalles}
                      </Typography>
                    </>
                  )}

                  {selectedUbicacion && (
                    <>
                      <Typography variant="h6">
                        Especialidad en {selectedUbicacion}
                      </Typography>
                      <Typography variant="body1">
                        {ubicacionInfo.especialidad} - {ubicacionInfo.detalles}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default EspecialidadesView;
