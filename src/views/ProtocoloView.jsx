import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, MenuItem, Card, CardContent } from '@mui/material';

const ProtocoloView = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [patologias, setPatologias] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [selectedPatologia, setSelectedPatologia] = useState('');
  const [patologiaInfo, setPatologiaInfo] = useState(null);
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    const fetchEspecialidades = () => {
      const especialidades = ['Ginecologia', 'CardiologíaAdulto', 'BroncoPulmonarInfantil', 'Otorrinolaringologia'];
      setEspecialidades(especialidades);
    };

    fetchEspecialidades();
  }, []);

  const fetchPatologias = async (especialidad) => {
    try {
      const especialidadArchivo = especialidad.toLowerCase().replace(/[^a-zA-Z]/g, '');
      const response = await fetch(`/public/data/jsons/${especialidadArchivo}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch patologias');
      }
      const data = await response.json();
      setPatologias(data.patologias);
    } catch (error) {
      console.error('Error fetching patologias:', error);
      setPatologias([]);
    }
  };

  const hospitalData = [
    {
      nombre: 'Hospital A',
      direccion: 'Dirección del Hospital A',
      url: 'https://www.google.cl/maps/place/Hospital+Angol+Dr.+Mauricio+Heyermann/@-37.8005395,-72.6928234,17z',
    },
    {
      nombre: 'Hospital B',
      direccion: 'Dirección del Hospital B',
      url: 'https://www.google.com/maps/embed?...',
    },
    {
      nombre: 'Hospital C',
      direccion: 'Dirección del Hospital C',
      url: 'https://www.google.com/maps/embed?...',
    },
    // Agrega más objetos según sea necesario
  ];

  const handleEspecialidadChange = (event) => {
    const especialidadSeleccionada = event.target.value;
    setSelectedEspecialidad(especialidadSeleccionada);
    setSelectedPatologia('');
    setPatologiaInfo(null);
    fetchPatologias(especialidadSeleccionada);
  };

  const handlePatologiaChange = (event) => {
    const patologiaSeleccionada = event.target.value;
    setSelectedPatologia(patologiaSeleccionada);
    const patologiaData = patologias.find(patologia => patologia.patologia === patologiaSeleccionada);
    setPatologiaInfo(patologiaData);

    // Ejemplo de URL para la especialidad BroncoPulmonarInfantil
    if (selectedEspecialidad === 'BroncoPulmonarInfantil') {
      setMapUrl('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.2672934011136!2d-46.65437748487383!3d-23.5987866846677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59e648bbf101%3A0xf59387e5b0e34090!2sHospital%20das%20Cl%C3%ADnicas%20da%20Faculdade%20de%20Medicina%20da%20Universidade%20de%20S%C3%A3o%20Paulo!5e0!3m2!1sen!2sbr!4v1615152025000!5m2!1sen!2sbr');
    } else {
      setMapUrl('');
    }
  };

  return (
    <div>
      <Box p={2}>
        <Typography variant="body2" color="textSecondary">
          Inicio &gt; Información Interconsultas &gt; Criterios de aceptación
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
              label="Patología"
              fullWidth
              variant="outlined"
              value={selectedPatologia}
              onChange={handlePatologiaChange}
              disabled={!selectedEspecialidad}
            >
              {patologias.map((patologia, index) => (
                <MenuItem key={index} value={patologia.patologia}>
                  {patologia.patologia}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {patologiaInfo && (
          <Grid container spacing={2} style={{ marginTop: '16px' }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Información sobre {patologiaInfo.patologia}
                  </Typography>
                  <Typography variant="subtitle1">
                    Criterios:
                  </Typography>
                  <Typography variant="body1">
                    {patologiaInfo.criterios}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">
                    Exámenes:
                  </Typography>
                  <Typography variant="body1">
                    {patologiaInfo.examenes}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">
                    Observaciones:
                  </Typography>
                  <Typography variant="body1">
                    {patologiaInfo.observaciones}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {mapUrl && (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Hospitales</Typography>
                    
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="450"
                      frameBorder="0"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      aria-hidden="false"
                      tabIndex="0"
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </div>
  );
};

export default ProtocoloView;
