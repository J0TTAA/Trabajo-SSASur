import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ContactCard from './ContactCard';

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
