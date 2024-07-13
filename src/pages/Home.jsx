import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import SearchFilters from '../components/SearchFilters';

const Home = () => {
  const [specialist, setSpecialist] = useState('');
  const [location, setLocation] = useState('');
  const [facility, setFacility] = useState('');

  const handleSpecialistChange = (event) => setSpecialist(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleFacilityChange = (event) => setFacility(event.target.value);

  const navigate = useNavigate();

  const navigateToCriteriosDerivacion = () => {
    navigate('/criterios-derivacion');
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
        <SearchFilters
          label="Especialista"
          value={specialist}
          onChange={handleSpecialistChange}
          options={[
            { value: 'neurocirujano', label: 'Neurocirujano' },
            // Otros especialistas...
          ]}
          style={{ flex: '1 1 300px', maxWidth: '300px', marginBottom: '20px' }}
        />
        <SearchFilters
          label="Ubicación"
          value={location}
          onChange={handleLocationChange}
          options={[
            { value: 'temuco', label: 'Temuco' },
            { value: 'padre-las-casas', label: 'Padre Las Casas' },
            // Otras ubicaciones...
          ]}
          style={{ flex: '1 1 300px', maxWidth: '300px', marginBottom: '20px' }}
        />
        <SearchFilters
          label="Establecimiento"
          value={facility}
          onChange={handleFacilityChange}
          options={[
            { value: 'hospital1', label: 'Hospital 1' },
            // Otros establecimientos...
          ]}
          style={{ flex: '1 1 300px', maxWidth: '300px', marginBottom: '20px' }}
        />
      </div>

      <button onClick={navigateToCriteriosDerivacion} style={{ margin: '20px', padding: '10px 20px', fontSize: '16px' }}>
        Ir a Criterios de Derivación
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px', backgroundColor: '#f0f0f0', maxWidth: '1200px', margin: 'auto' }}>
        <DoctorCard name="Dr. Alvaro Gomez" specialty="Neurocirujano" hospital="Hospital Padre Las Casas" style={{ flex: '1 1 300px', maxWidth: '300px', margin: '10px' }} />
        <DoctorCard name="Dr. Alvaro Gomez" specialty="Neurocirujano" hospital="Hospital Padre Las Casas" style={{ flex: '1 1 300px', maxWidth: '300px', margin: '10px' }} />
        <DoctorCard name="Dr. Alvaro Gomez" specialty="Neurocirujano" hospital="Hospital Padre Las Casas" style={{ flex: '1 1 300px', maxWidth: '300px', margin: '10px' }} />
        <DoctorCard name="Dr. Alvaro Gomez" specialty="Neurocirujano" hospital="Hospital Padre Las Casas" style={{ flex: '1 1 300px', maxWidth: '300px', margin: '10px' }} />
        <DoctorCard name="Dr. Alvaro Gomez" specialty="Neurocirujano" hospital="Hospital Padre Las Casas" style={{ flex: '1 1 300px', maxWidth: '300px', margin: '10px' }} />
        <DoctorCard name="Dr. Alvaro Gomez" specialty="Neurocirujano" hospital="Hospital Padre Las Casas" style={{ flex: '1 1 300px', maxWidth: '300px', margin: '10px' }} />
        {/* Más tarjetas de doctor */}
      </div>
    </>
  );
};

export default Home;