import React, { useState } from 'react';
import { Container, Box, Grid, Button, Drawer, TextField, IconButton, Typography } from '@mui/material';
import FilterComponent from '../components/FilterComponent';
import ContactList from '../components/ContactList';
import AddIcon from '@mui/icons-material/Add';

const contactsData = [
  { id: 1, name: 'Dr. Juan Gomez', specialty: 'Cardiologia', hospital: 'Hospital Padre Las Casas', cargo: 'Médico Controlador' },
  { id: 2, name: 'Dr. Alvaro Gomez', specialty: 'Neurocirugia', hospital: 'Hospital Padre Las Casas', cargo: 'Médico Controlador' },
  { id: 3, name: 'Dr. Esteban Gomez', specialty: 'Endocrinologia', hospital: 'Hospital Padre Las Casas', cargo: 'Médico Controlador' },
  { id: 4, name: 'Dr. Pedro Gomez', specialty: 'Neurocirugia', hospital: 'Hospital Padre Las Casas', cargo: 'Médico Controlador' },
];

const ContactView = () => {
  const [filters, setFilters] = useState({ cargo: '', especialidad: '', establecimiento: '' });
  const [filteredContacts, setFilteredContacts] = useState(contactsData);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', specialty: '', hospital: '', cargo: '' });
  const [editMode, setEditMode] = useState(false);
  const [editContact, setEditContact] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({ cargo: '', especialidad: '', establecimiento: '' });
    setFilteredContacts(contactsData); // Reset filtered contacts when clearing filters
  };

  const handleApplyFilters = () => {
    const filtered = contactsData.filter(contact => {
      return (
        (!filters.cargo || contact.cargo.includes(filters.cargo)) &&
        (!filters.especialidad || contact.specialty.includes(filters.especialidad)) &&
        (!filters.establecimiento || contact.hospital.includes(filters.establecimiento))
      );
    });
    setFilteredContacts(filtered);
  };

  const handleNewContactChange = (key, value) => {
    setNewContact({ ...newContact, [key]: value });
  };

  const handleAddContact = () => {
    if (editMode) {
      setFilteredContacts(filteredContacts.map(contact =>
        contact.id === editContact.id ? { ...editContact, ...newContact } : contact
      ));
    } else {
      setFilteredContacts([...filteredContacts, { id: filteredContacts.length + 1, ...newContact }]);
    }
    setNewContact({ name: '', specialty: '', hospital: '', cargo: '' });
    setEditMode(false);
    setDrawerOpen(false);
  };

  const handleEditContact = (contact) => {
    setEditContact(contact);
    setNewContact(contact);
    setEditMode(true);
    setDrawerOpen(true);
  };

  const handleDeleteContact = (id) => {
    setFilteredContacts(filteredContacts.filter(contact => contact.id !== id));
  };

  return (
    <Container>
      <Box my={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FilterComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <Button variant="contained" color="primary" onClick={handleApplyFilters} style={{ marginTop: '16px' }}>
              Aplicar Filtros
            </Button>
          </Grid>
          <Grid item xs={12} md={8}>
            <ContactList
              contacts={filteredContacts}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          </Grid>
        </Grid>
      </Box>
      <IconButton
        color="primary"
        onClick={() => setDrawerOpen(true)}
        style={{ position: 'fixed', bottom: '16px', right: '16px' }}
      >
        <AddIcon />
      </IconButton>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box p={2} width={300}>
          <Typography variant="h6">{editMode ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}</Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={newContact.name}
            onChange={(e) => handleNewContactChange('name', e.target.value)}
            margin="normal"
          />
          <TextField
            label="Especialidad"
            fullWidth
            value={newContact.specialty}
            onChange={(e) => handleNewContactChange('specialty', e.target.value)}
            margin="normal"
          />
          <TextField
            label="Hospital"
            fullWidth
            value={newContact.hospital}
            onChange={(e) => handleNewContactChange('hospital', e.target.value)}
            margin="normal"
          />
          <TextField
            label="Cargo"
            fullWidth
            value={newContact.cargo}
            onChange={(e) => handleNewContactChange('cargo', e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleAddContact} fullWidth>
            {editMode ? 'Guardar Cambios' : 'Agregar'}
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ContactView;
