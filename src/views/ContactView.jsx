import React, { useEffect, useState } from 'react';
import ContactList from '../components/ContactList';

const Contactos = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await fetch('http://localhost:8080/fhir/Practitioner');
        const data = await response.json();
        setPractitioners(data.entry.map(e => e.resource)); // Extraer recursos
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };

    fetchPractitioners();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Contactos</h1>
      <ContactList practitioners={practitioners} />
    </div>
  );
};

export default Contactos;
