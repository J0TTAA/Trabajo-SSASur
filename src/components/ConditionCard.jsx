import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const ConditionCard = ({ condition, onDelete, onEdit }) => {
  const { id, code, stage, note } = condition;

  // Manejadores de eventos para eliminar y editar
  const handleDelete = () => {
    onDelete(id);  // Usamos el id que tenemos en el objeto condition
  };

  const handleEdit = () => {
    onEdit(condition);  // Pasamos el objeto completo para edición
  };

  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          {code?.text || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Criterios: {stage?.[0]?.summary?.text || 'N/A'}
        </Typography>
        <Typography color="textSecondary">
          Observaciones: {note?.[0]?.text || 'N/A'}
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

ConditionCard.propTypes = {
  condition: PropTypes.shape({
    id: PropTypes.string.isRequired,  // El id de condition es requerido
    code: PropTypes.shape({
      text: PropTypes.string
    }),
    stage: PropTypes.arrayOf(PropTypes.shape({
      summary: PropTypes.shape({
        text: PropTypes.string
      })
    })),
    note: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string
    }))
  }).isRequired,
  onDelete: PropTypes.func.isRequired,  // Función para eliminar
  onEdit: PropTypes.func.isRequired     // Función para editar
};

export default ConditionCard;
