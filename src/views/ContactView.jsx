import React, { useEffect, useState } from 'react';
import ContactList from '../components/ContactList';

// Función para normalizar cadenas (quitar tildes y hacer que todo sea minúscula)
const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const Contactos = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [filteredPractitioners, setFilteredPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [cargo, setCargo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/Practitioner');
        const data = await response.json();
        const practitioners = data.entry.map(e => e.resource);
        setPractitioners(practitioners);
        setFilteredPractitioners(practitioners); // Mostrar todos inicialmente
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    fetchPractitioners();
  }, []);

  // Función para aplicar filtros
  const applyFilters = () => {
    let filtered = practitioners;

    if (cargo) {
      filtered = filtered.filter(practitioner => 
        practitioner.qualification?.some(q => q.code?.text?.toLowerCase().includes(cargo.toLowerCase()))
      );
    }
    
    if (especialidad) {
      filtered = filtered.filter(practitioner => 
        practitioner.qualification?.some(q => q.code?.text?.toLowerCase().includes(especialidad.toLowerCase()))
      );
    }
    
    if (establecimiento) {
      filtered = filtered.filter(practitioner => 
        practitioner.address?.some(a => a.city?.toLowerCase().includes(establecimiento.toLowerCase()))
      );
    }

    // Solo se aplican los filtros al hacer clic en el botón
    setFilteredPractitioners(filtered);
  };

  // Búsqueda en tiempo real, ignorando mayúsculas/minúsculas y tildes
  useEffect(() => {
    let filtered = practitioners;

    if (searchQuery) {
      filtered = filtered.filter(practitioner => 
        normalizeString(practitioner.name?.[0]?.given?.join(' ') || '').includes(normalizeString(searchQuery)) ||
        normalizeString(practitioner.name?.[0]?.family || '').includes(normalizeString(searchQuery))
      );
    } else {
      filtered = practitioners;
    }

    setFilteredPractitioners(filtered);
  }, [searchQuery, practitioners]);

  const resetFilters = () => {
    setCargo('');
    setEspecialidad('');
    setEstablecimiento('');
    setSearchQuery('');
    setFilteredPractitioners(practitioners); // Restablecer la lista completa
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  // Estilos en línea (actualizados para reflejar el layout de la imagen)
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    },
    filters: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '20px',
      justifyContent: 'center', // Alinear los filtros en el centro
    },
    select: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '150px'
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '200px'
    },
    buttonReset: {
      backgroundColor: '#9c27b0',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    buttonApply: {
      backgroundColor: '#2196f3',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    contactList: {
      width: '100%', // Esto asegura que la lista ocupe todo el ancho disponible
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'center' // Centrar la lista de contactos
    },
    contactCard: {
      border: '1px solid #ccc',
      padding: '15px',
      borderRadius: '5px',
      backgroundColor: 'white',
      width: '80%', // Ajustar el ancho de las tarjetas de contacto
      maxWidth: '600px' // Limitar el ancho máximo
    },
    contactCardHeader: {
      margin: '0'
    },
    contactCardParagraph: {
      margin: '5px 0'
    }
  };

  return (
    <div style={styles.container}>
      <h1>Contactos</h1>
      
      {/* Filtros */}
      <div style={styles.filters}>
        <select 
          value={cargo} 
          onChange={(e) => setCargo(e.target.value)} 
          style={styles.select} 
          placeholder="Cargo"
        >
          <option value="">Cargo</option>
          <option value="Médico">Médico</option>
          <option value="Contralor">Contralor</option>
          <option value="Priorizador">Priorizador</option>
        </select>

        <select 
          value={especialidad} 
          onChange={(e) => setEspecialidad(e.target.value)} 
          style={styles.select} 
          placeholder="Especialidad"
        >
          <option value="">Especialidad</option>
          <option value="Cardiología">Cardiología</option>
          <option value="Ginecología">Ginecología</option>
        </select>

        <select 
          value={establecimiento} 
          onChange={(e) => setEstablecimiento(e.target.value)} 
          style={styles.select} 
          placeholder="Establecimiento"
        >
          <option value="">Establecimiento</option>
          <option value="Star City">Star City</option>
        </select>

        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          style={styles.input} 
          placeholder="Buscar..." 
        />

        <button onClick={applyFilters} style={styles.buttonApply}>Aplicar Filtros</button>
        <button onClick={resetFilters} style={styles.buttonReset}>Limpiar Filtros</button>
      </div>

      {/* Lista de Contactos Filtrados */}
      <div style={styles.contactList}>
        {filteredPractitioners.map(practitioner => (
          <div key={practitioner.id} style={styles.contactCard}>
            <h2 style={styles.contactCardHeader}>
              {practitioner.name?.[0]?.given?.join(' ')} {practitioner.name?.[0]?.family}
            </h2>
            <p style={styles.contactCardParagraph}>Cargo: {practitioner.qualification?.[0]?.code?.text || 'N/A'}</p>
            <p style={styles.contactCardParagraph}>Especialidad: {practitioner.qualification?.[0]?.code?.text || 'N/A'}</p>
            <p style={styles.contactCardParagraph}>Establecimiento: {practitioner.address?.[0]?.city || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contactos;
