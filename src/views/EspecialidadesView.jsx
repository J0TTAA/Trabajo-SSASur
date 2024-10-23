import React, { useEffect, useState } from 'react';

const EspecialidadesView = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [ubicaciones, setUbicaciones] = useState([]);

  // Al montar el componente, obtener las especialidades
  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/HealthcareService');
        const data = await response.json();
        const servicios = data.entry || [];

        // Extraer especialidades únicas
        const especialidadesUnicas = [...new Set(
          servicios
            .map(item => item.resource.specialty?.[0]?.coding?.[0]?.display)
            .filter(Boolean) // Filtrar valores falsos
        )];
        
        setEspecialidades(especialidadesUnicas);
      } catch (error) {
        console.error('Error fetching especialidades:', error);
      }
    };

    fetchEspecialidades();
  }, []);

  // Extraer todos los números después de 'Location/' en el texto del JSON
  const extraerIdsDeUbicaciones = (json) => {
    const regex = /Location\/(\d+)/g;
    let match;
    const ids = [];
    
    while ((match = regex.exec(json)) !== null) {
      ids.push(match[1]); // Guardar el número después de 'Location/'
    }
    
    return ids;
  };

  // Obtener las ubicaciones por IDs
  const obtenerUbicacionesPorIds = async (ids) => {
    const ubicacionesPromises = ids.map(async (id) => {
      const response = await fetch(`http://localhost:8080/fhir/Location/${id}`);
      const data = await response.json();
      return data; // Devolver los datos de la ubicación
    });

    const ubicacionesResultados = await Promise.all(ubicacionesPromises);
    return ubicacionesResultados.filter(Boolean); // Filtrar resultados válidos
  };

  // Manejar el cambio de selección de especialidad
  const handleEspecialidadChange = async (event) => {
    const especialidadSeleccionada = event.target.value;
    setSelectedEspecialidad(especialidadSeleccionada);

    try {
      // Obtener todos los servicios de salud
      const response = await fetch('http://localhost:8080/fhir/HealthcareService');
      const textData = await response.text(); // Obtener el JSON como texto
      const serviciosSalud = JSON.parse(textData).entry || [];

      // Filtrar los HealthcareServices que tienen la especialidad seleccionada
      const serviciosFiltrados = serviciosSalud.filter(
        item => item.resource.specialty?.[0]?.coding?.[0]?.display === especialidadSeleccionada
      );

      // Convertir el objeto JSON en texto para buscar los Location/
      const jsonString = JSON.stringify(serviciosFiltrados);
      const idsUbicaciones = extraerIdsDeUbicaciones(jsonString);

      // Obtener las ubicaciones usando los IDs extraídos
      const ubicacionesFinales = await obtenerUbicacionesPorIds(idsUbicaciones);
      setUbicaciones(ubicacionesFinales);
    } catch (error) {
      console.error('Error fetching ubicaciones:', error);
      setUbicaciones([]); // Limpiar ubicaciones si ocurre un error
    }
  };

  return (
    <div>
      <h1>Especialidades de Servicios de Salud</h1>
      <label>
        Seleccionar Especialidad:
        <select value={selectedEspecialidad} onChange={handleEspecialidadChange}>
          <option value="">--Seleccione--</option>
          {especialidades.map((especialidad, index) => (
            <option key={index} value={especialidad}>{especialidad}</option>
          ))}
        </select>
      </label>
      
      <h2>Ubicaciones:</h2>
      {ubicaciones.length > 0 ? (
        <ul>
          {ubicaciones.map((ubicacion, index) => (
            <li key={index}>{ubicacion.name || 'Nombre no disponible'}</li> // Mostrar el nombre de la ubicación o un mensaje si no está disponible
          ))}
        </ul>
      ) : (
        <p>No hay ubicaciones disponibles.</p>
      )}
    </div>
  );
};

export default EspecialidadesView;
