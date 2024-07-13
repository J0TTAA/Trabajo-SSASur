import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DoctorCard from '../components/DoctorCard';
import SearchFilters from '../components/SearchFilters';
import RichTextEditor from '../components/TextEditor';

const CriteriosDerivacion = () => {
  const [specialist, setSpecialist] = useState('');
  const [location, setLocation] = useState('');
  const [facility, setFacility] = useState('');

  const handleSpecialistChange = (event) => setSpecialist(event.target.value);
  const handleLocationChange = (event) => setLocation(event.target.value);
  const handleFacilityChange = (event) => setFacility(event.target.value);

  const navigate = useNavigate();

  const [text, setText] = useState('');
  const handleTextChange = (value) => {
    setText(value);
  };

  const navigateToCriteriosDerivacion = () => {
    navigate('/criterios-derivacion');
  };

  const handleSave = () => {
    // Lógica para guardar los datos
    console.log('Datos guardados');
  };

  const handleCancel = () => {
    // Lógica para cancelar la acción
    console.log('Acción cancelada');
  };

  const handleViewMode = () => {
    // Lógica para cambiar al modo vista lector
    console.log('Modo vista lector activado');
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
          label="Establecimiento"
          value={facility}
          onChange={handleFacilityChange}
          options={[
            { value: 'hospital1', label: 'Hospital 1' },
            // Otros establecimientos...
          ]}
          style={{ flex: '1 1 300px', maxWidth: '300px', marginBottom: '20px' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleSave}>Guardar</button>
          <button onClick={handleCancel}>Cancelar</button>
          <button onClick={handleViewMode}>Vista Lector</button>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: '1' }}>
          <h2>Criterios Derivación</h2>
          <RichTextEditor value={text} onChange={handleTextChange} />
        </div>

        <div style={{ flex: '1' }}>
          <h2>Exámenes Requeridos</h2>
          <RichTextEditor value={text} onChange={handleTextChange} />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h2>Observaciones / Sugerencias Manejo APS</h2>
        <RichTextEditor value={text} onChange={handleTextChange} />
      </div>

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

export default CriteriosDerivacion;
