import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const ContactCard = ({ practitioner, onDelete, onEdit }) => {
  const { id, name, telecom, address, qualification } = practitioner;

  const phone = telecom?.find(t => t.system === 'phone')?.value;

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
          Dirección: {address?.[0]?.line?.[0]}, {address?.[0]?.city}, {address?.[0]?.postalCode}, {address?.[0]?.country}
        </Typography>
        <Typography color="textSecondary">
          Especialidad: {qualification?.[0]?.code?.text || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Certificación desde: {qualification?.[0]?.period?.start || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Emitido por: {qualification?.[0]?.issuer?.display || 'N/A'}
        </Typography>

        {/* Botones de acciones */}
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

ContactCard.propTypes = {
  practitioner: PropTypes.shape({
    id: PropTypes.string.isRequired,  // El id del practitioner es requerido
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
  }).isRequired,
  onDelete: PropTypes.func.isRequired,  // Función para eliminar
  onEdit: PropTypes.func.isRequired     // Función para editar
};

export default ContactCard;
