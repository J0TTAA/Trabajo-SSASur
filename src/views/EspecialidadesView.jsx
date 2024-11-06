import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Typography, Grid, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
/**
 * Componente para mostrar las especialidades de servicios de salud por ubicación
 * usando un mapa interactivo con Leaflet.
 */
const EspecialidadesView = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [ubicaciones, setUbicaciones] = useState([]);
  const [especialidadesPorUbicacion, setEspecialidadesPorUbicacion] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Configuración del icono del marcador
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
/**
   * Hook para obtener las especialidades y ubicaciones desde el servidor FHIR
   * y almacenarlas en el estado local.
   */
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/HealthcareService');
        const data = await response.json();
        const servicios = data.entry || [];
// Extrae especialidades únicas de los servicios de salud
        const especialidadesUnicas = [...new Set(
          servicios.map(item => item.resource.specialty?.[0]?.coding?.[0]?.display).filter(Boolean)
        )];
        setEspecialidades(especialidadesUnicas);
      } catch (error) {
        console.error('Error fetching especialidades:', error);
      }
    };

    const fetchUbicaciones = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/Location');
        const data = await response.json();
        const ubicaciones = data.entry || [];
  // Mapea las ubicaciones para obtener el id y nombre
        const ubicacionesMapeadas = ubicaciones.map(item => ({
          id: item.resource.id,
          name: item.resource.name || 'Nombre no disponible',
        }));
        setUbicaciones(ubicacionesMapeadas);
      } catch (error) {
        console.error('Error fetching ubicaciones:', error);
      }
    };

    fetchEspecialidades();
    fetchUbicaciones();
  }, []);
 /**
   * Extrae los IDs de ubicaciones de un JSON de servicios filtrados.
   * @param {string} json - El JSON que contiene los servicios filtrados.
   * @returns {Array<string>} - Un arreglo de IDs de ubicaciones.
   */
  const extraerIdsDeUbicaciones = (json) => {
    const regex = /Location\/(\d+)/g;
    let match;
    const ids = [];
    while ((match = regex.exec(json)) !== null) ids.push(match[1]);
    return ids;
  };
/**
   * Obtiene los detalles de las ubicaciones mediante sus IDs.
   * @param {Array<string>} ids - Arreglo de IDs de ubicaciones.
   * @returns {Promise<Array>} - Una promesa con los detalles de las ubicaciones.
   */
  const obtenerUbicacionesPorIds = async (ids) => {
    const ubicacionesPromises = ids.map(async (id) => {
      const response = await fetch(`http://localhost:8080/fhir/Location/${id}`);
      const data = await response.json();
      return data;
    });

    const ubicacionesResultados = await Promise.all(ubicacionesPromises);
    return ubicacionesResultados.filter(Boolean);
  };
/**
   * Maneja el cambio de especialidad seleccionada.
   * Filtra los servicios de salud por la especialidad seleccionada
   * y obtiene las ubicaciones asociadas.
   * @param {Object} event - El evento de cambio de especialidad.
   */
  const handleEspecialidadChange = async (event) => {
    const especialidadSeleccionada = event.target.value;
    setSelectedEspecialidad(especialidadSeleccionada);

    try {
      const response = await fetch('http://localhost:8080/fhir/HealthcareService');
      const textData = await response.text();
      const serviciosSalud = JSON.parse(textData).entry || [];
 // Filtra los servicios por la especialidad seleccionada
      const serviciosFiltrados = serviciosSalud.filter(
        item => item.resource.specialty?.[0]?.coding?.[0]?.display === especialidadSeleccionada
      );

      const jsonString = JSON.stringify(serviciosFiltrados);
      const idsUbicaciones = extraerIdsDeUbicaciones(jsonString);
 // Obtiene las ubicaciones asociadas a los servicios filtrados
      const ubicacionesFinales = await obtenerUbicacionesPorIds(idsUbicaciones);
      setUbicaciones(ubicacionesFinales);
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
      setUbicaciones([]);
    }
  };
  /**
   * Maneja el cambio de ubicación seleccionada.
   * Obtiene los detalles de la ubicación y la geolocalización asociada.
   * @param {Object} event - El evento de cambio de ubicación.
   */
  const handleUbicacionChange = async (event) => {
    const ubicacionId = event.target.value;

    try {
      const response = await fetch(`http://localhost:8080/fhir/Location/${ubicacionId}`);
      const locationData = await response.json();
  // Busca la extensión de geolocalización para obtener la latitud y longitud
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
    <Box sx={{ width: "80%",p: 3 ,mx: "auto", justifyContent: "center" }}>
      <Typography variant="h4" gutterBottom>Especialidades de Servicios de Salud</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Especialidad</InputLabel>
            <Select value={selectedEspecialidad} onChange={handleEspecialidadChange} label="Seleccionar Especialidad">
              <MenuItem value="">
                <em>--Seleccione--</em>
              </MenuItem>
              {especialidades.map((especialidad, index) => (
                <MenuItem key={index} value={especialidad}>{especialidad}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccionar Ubicación</InputLabel>
            <Select onChange={handleUbicacionChange} label="Seleccionar Ubicación">
              <MenuItem value="">
                <em>--Seleccione--</em>
              </MenuItem>
              {ubicaciones.map((ubicacion) => (
                <MenuItem key={ubicacion.id} value={ubicacion.id}>{ubicacion.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4 }}>Especialidades por Ubicación:</Typography>
      {especialidadesPorUbicacion.length > 0 ? (
        <ul>
          {especialidadesPorUbicacion.map((especialidad, index) => (
            <li key={index}>{especialidad}</li>
          ))}
        </ul>
      ) : (
        <Typography>No hay especialidades para esta ubicación.</Typography>
      )}

      {selectedLocation && (
        <MapContainer center={[selectedLocation.latitude, selectedLocation.longitude]} zoom={15} style={{ height: '600px', width: '100%', marginTop: '20px' }}>
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
  );
};

export default EspecialidadesView;
