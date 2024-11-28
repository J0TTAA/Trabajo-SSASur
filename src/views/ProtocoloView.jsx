import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, TextField, MenuItem, Card, CardContent, FormControl, InputLabel, Select } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
 /**
 * Vista para mostrar las patologías y ubicaciones asociadas a una especialidad médica.
 * 
 * Esta vista permite al usuario seleccionar una especialidad médica y, en función de ella, 
 * se cargan las patologías relacionadas. Al seleccionar una patología, se muestra información 
 * adicional sobre la misma, como observaciones, criterios y exámenes. También se muestran las 
 * ubicaciones asociadas a los servicios de salud relacionados con la especialidad y patología 
 * seleccionadas en un mapa interactivo.
 * 
 * @component
 * @example
 * return (
 *   <ProtocoloView />
 * );
 */
const ProtocoloView = () => {
   // Estado para almacenar especialidades, patologías, ubicaciones y detalles de patología
  const [especialidades, setEspecialidades] = useState([]);// Especialidades médicas disponibles
  const [patologias, setPatologias] = useState([]);// Patologías asociadas a la especialidad seleccionada
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');// Especialidad seleccionada por el usuario
  const [selectedPatologia, setSelectedPatologia] = useState('');// Patología seleccionada por el usuario
  const [patologiaInfo, setPatologiaInfo] = useState(null);// Detalles de la patología seleccionada
  const [ubicaciones, setUbicaciones] = useState([]);// Ubicaciones de servicios de salud para la patología seleccionada


  /**
   * Configura el icono del marcador para el mapa.
   * Esta configuración sobrescribe el icono predeterminado de Leaflet.
   */
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });

 /**
   * Efecto que se ejecuta al cargar la vista, encargado de obtener las especialidades médicas disponibles.
   * Llama a la API de HealthcareService para obtener las especialidades disponibles.
   */
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/HealthcareService');
        const data = await response.json();
        const servicios = data.entry || [];

        const especialidadesUnicas = [...new Set(
          servicios.map(item => item.resource.specialty?.[0]?.coding?.[0]?.display).filter(Boolean)
        )];
        setEspecialidades(especialidadesUnicas);
      } catch (error) {
        console.error('Error fetching especialidades:', error);
      }
    };

    fetchEspecialidades();
  }, []);
 /**
   * Extrae los IDs de las ubicaciones desde el JSON de servicios de salud.
   * @param {string} json - El JSON que contiene la información de los servicios de salud.
   * @returns {Array<string>} Una lista de IDs de ubicaciones.
   */
  const extraerIdsDeUbicaciones = (json) => {
    const regex = /Location\/(\d+)/g;
    let match;
    const ids = [];
    while ((match = regex.exec(json)) !== null) ids.push(match[1]);
    return ids;
  };

 /**
   * Obtiene las ubicaciones a partir de los IDs proporcionados.
   * @param {Array<string>} ids - Los IDs de las ubicaciones a obtener.
   * @returns {Promise<Array<Object>>} Una promesa que resuelve con una lista de objetos de ubicación.
   */
  const obtenerUbicacionesPorIds = async (ids) => {
    const ubicacionesPromises = ids.map(async (id) => {
      const response = await fetch(`http://localhost:8080/fhir/Location/${id}`);
      const data = await response.json();
      const geolocationExtension = data.extension?.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/geolocation");
      const latitude = geolocationExtension?.extension?.find(ext => ext.url === "latitude")?.valueDecimal;
      const longitude = geolocationExtension?.extension?.find(ext => ext.url === "longitude")?.valueDecimal;
      return latitude && longitude ? { id: data.id, name: data.name || 'Nombre no disponible', latitude, longitude } : null;
    });
    const ubicacionesResultados = await Promise.all(ubicacionesPromises);
    return ubicacionesResultados.filter(Boolean);
  };

 /**
   * Obtiene las patologías asociadas a una especialidad.
   * Filtra las patologías basadas en la especialidad seleccionada.
   * @param {string} especialidad - La especialidad seleccionada por el usuario.
   */
  const fetchPatologias = async (especialidad) => {
    try {
      const response = await fetch('http://localhost:8080/fhir/Condition');
      const data = await response.json();

      const especialidadNormalized = especialidad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const patologiasFiltradas = data.entry
        .map(entry => entry.resource)
        .filter(patologia => {
          const codeText = patologia.code?.text?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const categoryTextMatches = patologia.category?.some(cat =>
            cat.text?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(especialidadNormalized)
          );
          return codeText.includes(especialidadNormalized) || categoryTextMatches;
        })
        .map(patologia => ({
          id: patologia.id,
          text: patologia.code?.text || "Texto no disponible",
        }));

      setPatologias(patologiasFiltradas);
    } catch (error) {
      console.error('Error fetching patologias:', error);
    }
  };

 /**
   * Obtiene los detalles de una patología seleccionada.
   * @param {string} patologiaId - El ID de la patología seleccionada.
   */

  const fetchPatologiaDetalles = async (patologiaId) => {
    try {
      const response = await fetch(`http://localhost:8080/fhir/Condition/${patologiaId}`);
      const data = await response.json();

      const notas = data.note?.map(note => note.text) || [];
      setPatologiaInfo({
        observaciones: notas[0] || 'No disponibles',
        criterios: notas[1] || 'No disponibles',
        examenes: notas[2] || 'No disponibles'
      });
    } catch (error) {
      console.error('Error fetching patologia details:', error);
    }
  };

 /**
   * Maneja el cambio de especialidad seleccionada.
   * Al seleccionar una nueva especialidad, se obtienen las patologías y ubicaciones correspondientes.
   * @param {object} event - El evento del cambio de valor en el selector de especialidad.
   */

  const handleEspecialidadChange = async (event) => {
    const especialidadSeleccionada = event.target.value;
    setSelectedEspecialidad(especialidadSeleccionada);
    setPatologiaInfo(null);
    setSelectedPatologia('');
    await fetchPatologias(especialidadSeleccionada);

    try {
      const response = await fetch('http://localhost:8080/fhir/HealthcareService');
      const textData = await response.text();
      const serviciosSalud = JSON.parse(textData).entry || [];
      const serviciosFiltrados = serviciosSalud.filter(
        item => item.resource.specialty?.[0]?.coding?.[0]?.display === especialidadSeleccionada
      );
      const jsonString = JSON.stringify(serviciosFiltrados);
      const idsUbicaciones = extraerIdsDeUbicaciones(jsonString);
      const ubicacionesFinales = await obtenerUbicacionesPorIds(idsUbicaciones);
      setUbicaciones(ubicacionesFinales);
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
      setUbicaciones([]);
    }
  };
 /**
   * Maneja el cambio de patología seleccionada.
   * Al seleccionar una nueva patología, se obtienen sus detalles.
   * @param {object} event - El evento del cambio de valor en el selector de patología.
   */
  const handlePatologiaChange = (event) => {
    const patologiaId = event.target.value;
    setSelectedPatologia(patologiaId);
    fetchPatologiaDetalles(patologiaId);
  };

  return (
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
              <MenuItem key={index} value={patologia.id}>
                {patologia.text}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: '16px' }}> 
        {/* Dos bloques en la parte superior */} 
        <Grid item xs={12} sm={6}> 
          <Card> <CardContent> <Typography variant="h6">Criterios de Derivación</Typography> 
          <Typography variant="body1">{patologiaInfo ? patologiaInfo.criterios : 'Seleccione una patología para ver detalles.'}</Typography> 
          </CardContent> </Card> </Grid> <Grid item xs={12} sm={6}> <Card> <CardContent> <Typography variant="h6">Exámenes Requeridos</Typography> 
          <Typography variant="body1">{patologiaInfo ? patologiaInfo.examenes : 'Seleccione una patología para ver detalles.'}</Typography> </CardContent> </Card> </Grid>
           {/* Bloque único grande abajo */} 
           <Grid item xs={12}> <Card> <CardContent> <Typography variant="h6">Observaciones </Typography> <Typography variant="body1">{patologiaInfo ? patologiaInfo.observaciones : 'Seleccione una patología para ver detalles.'}</Typography> </CardContent> </Card> </Grid> </Grid>


           {selectedEspecialidad && (
  <Box my={2} sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
    <FormControl fullWidth sx={{ maxWidth: 300 }}>
      <InputLabel htmlFor="especialidad-seleccionada">Especialidad Seleccionada</InputLabel>
      <Select
        value={selectedEspecialidad}
        inputProps={{
          readOnly: true,
          id: 'especialidad-seleccionada',
        }}
      >
        <MenuItem value={selectedEspecialidad}>{selectedEspecialidad}</MenuItem>
      </Select>
    </FormControl>
  </Box>
)}



      {selectedPatologia && ubicaciones.length > 0 ? (
        <Box mt={4}>
          <MapContainer center={[ubicaciones[0].latitude, ubicaciones[0].longitude]} zoom={10} style={{ height: '400px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {ubicaciones.map((ubicacion) => (
              <Marker key={ubicacion.id} position={[ubicacion.latitude, ubicacion.longitude]}>
                <Popup>{ubicacion.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      ) : (
        <Typography variant="body2" mt={2}>Seleccione una patología para ver las ubicaciones.</Typography>
      )}
    </Box>
  );
};






export default ProtocoloView;
