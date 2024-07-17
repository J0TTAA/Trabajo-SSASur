import React, { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import ContactCard from './ContactCard';

const ContactList = ({ contacts, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    let result = contacts;

    if (search) {
      result = result.filter(contact => contact.name.toLowerCase().includes(search.toLowerCase()));
    }

    setFilteredContacts(result);
  }, [contacts, search]);

  return (
    <Box>
      <TextField
        label="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {filteredContacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};

export default ContactList;
