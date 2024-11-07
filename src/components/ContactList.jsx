import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ContactCard from './ContactCard';

/**
 * Componente que muestra una lista de tarjetas de contacto para cada profesional.
 * 
 * @component
 * @example
 * const practitioners = [{ id: 1, name: 'Dr. John Doe', specialty: 'Cardiology' }];
 * const handleDelete = (id) => { console.log('Delete', id); };
 * const handleEdit = (id) => { console.log('Edit', id); };
 * 
 * return (
 *   <ContactList 
 *     practitioners={practitioners} 
 *     onDelete={handleDelete} 
 *     onEdit={handleEdit} 
 *   />
 * );
 * 
 * @param {Object[]} practitioners - Lista de profesionales de la salud.
 * @param {function} onDelete - Función para manejar la eliminación de un profesional.
 * @param {function} onEdit - Función para manejar la edición de un profesional.
 * @returns {JSX.Element} El componente de la lista de contactos.
 */
const ContactList = ({ practitioners, onDelete, onEdit }) => {
  return (
    <Grid container spacing={2}>
      {practitioners.map(practitioner => (
        <Grid item xs={12} sm={6} md={4} key={practitioner.id}>
          <ContactCard 
            practitioner={practitioner} 
            onDelete={onDelete} 
            onEdit={onEdit} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

ContactList.propTypes = {
  practitioners: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ContactList;
