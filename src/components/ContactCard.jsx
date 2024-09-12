import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ContactCard = ({ contact }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{contact.name}</Typography>
        <Typography variant="body2">{contact.phone}</Typography>
        <Typography variant="body2">{contact.email}</Typography>
        <Typography variant="body2">{contact.hospital}</Typography>
        <Typography variant="body2">{contact.cargo}</Typography>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
