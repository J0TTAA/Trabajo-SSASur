import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

/**
 * Componente ContactCard que muestra los detalles de contacto de un profesional,
 * incluyendo nombre, teléfono, correo electrónico, dirección, género y calificación.
 * También proporciona botones para editar y eliminar el contacto.
 * 
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.practitioner - Datos del profesional a mostrar.
 * @param {string} props.practitioner.id - Identificador único del profesional.
 * @param {Array<Object>} props.practitioner.name - Array que contiene los detalles del nombre (primer y apellido).
 * @param {Array<Object>} props.practitioner.telecom - Array que contiene los datos de contacto, como teléfono y correo electrónico.
 * @param {Array<Object>} props.practitioner.address - Array con la dirección del profesional (línea de dirección, ciudad, código postal, país).
 * @param {string} props.practitioner.gender - Género del profesional.
 * @param {Array<Object>} props.practitioner.qualification - Array que contiene la calificación profesional, con detalles sobre el cargo.
 * @param {function} props.onDelete - Función para eliminar el contacto, pasando el ID del profesional.
 * @param {function} props.onEdit - Función para editar el contacto, pasando el objeto completo del profesional.
 * 
 * @returns {JSX.Element} - Componente que muestra la tarjeta del contacto.
 */
const ContactCard = ({ practitioner, onDelete, onEdit }) => {
  const { id, name, telecom, address, qualification } = practitioner;

  // Obtener el teléfono
  const phone = telecom?.find(t => t.system === 'phone')?.value;
  // Obtener el email
  const email = telecom?.find(t => t.system === 'email')?.value;

  // Manejadores de eventos para eliminar y editar
  const handleDelete = () => {
    onDelete(id);  // Usamos el id que tenemos en el objeto practitioner
  };

  const handleEdit = () => {
    onEdit(practitioner);  // Pasamos el objeto completo para edición
  };

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {`${name?.[0]?.given?.join(' ')} ${name?.[0]?.family}`}
        </Typography>
        <Typography color="textSecondary">
          Teléfono: {phone || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Email: {email || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Establecimiento: {address?.[0]?.line?.[0]}, {address?.[0]?.city}, {address?.[0]?.postalCode}, {address?.[0]?.country}
        </Typography>
        <Typography color="textSecondary">
          Género: {practitioner.gender || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Cargo: {qualification?.[0]?.code?.text || 'N/A'}
        </Typography>

        <Box sx={{ marginTop: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleEdit} sx={{ marginRight: 1 }}>
            Editar
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDelete}>
            Eliminar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Validación de las propiedades del componente
ContactCard.propTypes = {
  practitioner: PropTypes.shape({
    id: PropTypes.string.isRequired, 
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
    gender: PropTypes.string,
    qualification: PropTypes.arrayOf(PropTypes.shape({
      code: PropTypes.shape({
        text: PropTypes.string
      })
    }))
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired    
};

export default ContactCard;
