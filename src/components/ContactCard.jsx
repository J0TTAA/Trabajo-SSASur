import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{contact.name}</Typography>
        <Typography variant="body2">{contact.phone}</Typography>
        <Typography variant="body2">{contact.email}</Typography>
        <Typography variant="body2">{contact.hospital}</Typography>
        <Typography variant="body2">{contact.cargo}</Typography>
        <Box mt={2}>
          <IconButton onClick={() => onEdit(contact)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => onDelete(contact.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
