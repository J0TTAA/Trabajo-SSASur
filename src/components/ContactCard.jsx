import React from 'react';
import PropTypes from 'prop-types';

const ContactCard = ({ practitioner }) => {
  const { name, telecom, address, qualification } = practitioner;

  return (
    <div className="contact-card">
      <h2>{`${name?.[0]?.given?.join(' ')} ${name?.[0]?.family}`}</h2>
      <p>Email: {telecom?.find(t => t.system === 'email')?.value}</p>
      <p>Dirección: {address?.[0]?.line?.[0]}, {address?.[0]?.city}, {address?.[0]?.postalCode}, {address?.[0]?.country}</p>
      <p>Especialidad: {qualification?.[0]?.code?.text}</p>
      <p>Certificación desde: {qualification?.[0]?.period?.start}</p>
      <p>Emitido por: {qualification?.[0]?.issuer?.display}</p>
    </div>
  );
};

// Agregar validación de propiedades
ContactCard.propTypes = {
  practitioner: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.shape({
      family: PropTypes.string,
      given: PropTypes.arrayOf(PropTypes.string)
    })),
    telecom: PropTypes.arrayOf(PropTypes.shape({
      system: PropTypes.string,
      value: PropTypes.string
    })),
    address: PropTypes.arrayOf(PropTypes.shape({
      line: PropTypes.arrayOf(PropTypes.string),
      city: PropTypes.string,
      postalCode: PropTypes.string,
      country: PropTypes.string
    })),
    qualification: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.shape({
        text: PropTypes.string
      }),
      period: PropTypes.shape({
        start: PropTypes.string
      }),
      issuer: PropTypes.shape({
        display: PropTypes.string
      })
    }))
  }).isRequired
};

export default ContactCard;
