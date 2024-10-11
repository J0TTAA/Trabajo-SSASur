import React from 'react';
import PropTypes from 'prop-types';
import ContactCard from './ContactCard';

const ContactList = ({ practitioners }) => {
  return (
    <div className="contact-list">
      {practitioners.map(practitioner => (
        <ContactCard key={practitioner.id} practitioner={practitioner} />
      ))}
    </div>
  );
};

// Agregar validación de propiedades
ContactList.propTypes = {
  practitioners: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired
};

export default ContactList;
