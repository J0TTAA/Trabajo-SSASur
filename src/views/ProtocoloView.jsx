import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, MenuItem, Card, CardContent, FormControl, InputLabel, Select } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ProtocoloView = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [patologias, setPatologias] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [selectedPatologia, setSelectedPatologia] = useState('');
  const [patologiaInfo, setPatologiaInfo] = useState(null);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Configuración del icono del marcador
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });

  useEffect(() => {
    const fetchEspecialidades = () => {
      const especialidades = ['Ginecología', 'Cardiología Adulto', 'Broncopulmonar Infantil', 'Otorrinolaringología'];
      setEspecialidades(especialidades);
    };

    const fetchUbicaciones = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/Location');
        const data = await response.json();
        const ubicaciones = data.entry.map(item => ({
          id: item.resource.id,
          name: item.resource.name || 'Nombre no disponible',
        }));
        setUbicaciones(ubicaciones);
      } catch (error) {
        console.error('Error fetching ubicaciones:', error);
      }
    };

    fetchEspecialidades();
    fetchUbicaciones();
  }, []);

  const fetchPatologias = async () => {
    try {
      const response = await fetch('http://localhost:8080/fhir/Condition');
      const data = await response.json();
      setPatologias(data.entry.map(entry => entry.resource));
    } catch (error) {
      console.error('Error fetching patologias:', error);
    }
  };

  const handleEspecialidadChange = (event) => {
    setSelectedEspecialidad(event.target.value);
    fetchPatologias();
  };

  const handlePatologiaChange = (event) => {
    const patologiaSeleccionada = event.target.value;
    setSelectedPatologia(patologiaSeleccionada);
    const patologiaData = patologias.find(patologia => patologia.code.text === patologiaSeleccionada);
    setPatologiaInfo(patologiaData);
  };

  const handleUbicacionChange = async (event) => {
    const ubicacionId = event.target.value;

    try {
      const response = await fetch(`http://localhost:8080/fhir/Location/${ubicacionId}`);
      const locationData = await response.json();

      const geolocationExtension = locationData.extension?.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/geolocation");
      const latitude = geolocationExtension?.extension?.find(ext => ext.url === "latitude")?.valueDecimal;
      const longitude = geolocationExtension?.extension?.find(ext => ext.url === "longitude")?.valueDecimal;

      if (latitude && longitude) {
        setSelectedLocation({ latitude, longitude, name: locationData.name });
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  return (
    <div>
      <Box p={2} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Typography variant="h6">Criterios de Aceptación</Typography>

        <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Especialidad</InputLabel>
              <Select value={selectedEspecialidad} onChange={handleEspecialidadChange}>
                {especialidades.map((especialidad, index) => (
                  <MenuItem key={index} value={especialidad}>
                    {especialidad}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Patología"
              fullWidth
              value={selectedPatologia}
              onChange={handlePatologiaChange}
              disabled={!selectedEspecialidad}
            >
              {patologias.map((patologia, index) => (
                <MenuItem key={index} value={patologia.code.text}>
                  {patologia.code.text}
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
                  <Typography variant="h6">Información sobre {patologiaInfo.code.text}</Typography>
                  {/* Mostrar criterios, observaciones y exámenes */}
                  <Typography variant="body1">
                    Observaciones: {patologiaInfo.note?.find(note => note.text === 'observaciones')?.text || 'No disponibles'}
                  </Typography>
                  <Typography variant="body1">
                    Criterios: {patologiaInfo.note?.find(note => note.text === 'criterios')?.text || 'No disponibles'}
                  </Typography>
                  <Typography variant="body1">
                    Exámenes: {patologiaInfo.note?.find(note => note.text === 'examenes')?.text || 'No disponibles'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={2} style={{ marginTop: '16px' }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Ubicación</InputLabel>
              <Select onChange={handleUbicacionChange}>
                {ubicaciones.map(ubicacion => (
                  <MenuItem key={ubicacion.id} value={ubicacion.id}>
                    {ubicacion.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {selectedLocation && (
          <MapContainer center={[selectedLocation.latitude, selectedLocation.longitude]} zoom={15} style={{ height: '400px', width: '100%', marginTop: '20px' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[selectedLocation.latitude, selectedLocation.longitude]}>
              <Popup>{selectedLocation.name}</Popup>
            </Marker>
          </MapContainer>
        )}
      </Box>
    </div>
  );
};

export default ProtocoloView;
