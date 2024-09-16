// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Container, Box, Grid, Button, Drawer, TextField, IconButton, Typography } from '@mui/material';
import FilterComponent from '../components/FilterComponent';
import ContactList from '../components/ContactListAdmin';
import AddIcon from '@mui/icons-material/Add';

const ContactView = () => {
  const [contactsData, setContactsData] = useState([]);
  const [filters, setFilters] = useState({ cargo: '', especialidad: '', establecimiento: '' });
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', specialty: '', hospital: '', cargo: '' });
  const [editMode, setEditMode] = useState(false);
  const [editContact, setEditContact] = useState(null);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch('/public/contactosJson/contactosjson.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        
        const contacts = jsonData.map(contact => ({
          id: contact.id,
          name: `${contact.name[0]?.given.join(' ')} ${contact.name[0]?.family}`,
          active: contact.active,
          phone: contact.telecom?.find(t => t.system === 'phone')?.value || 'No disponible',
          email: contact.telecom?.find(t => t.system === 'email')?.value || 'No disponible',
          hospital: contact.address?.[0]?.city || 'No disponible',
          cargo: contact.cargo
        }));

        setContactsData(contacts);
        setFilteredContacts(contacts);
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    };
  
    loadContacts();
  }, []);
  
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setFilters({ cargo: '', especialidad: '', establecimiento: '' });
    setFilteredContacts(contactsData);
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
    const newId = contactsData.length + 1;
    const contact = { id: newId, ...newContact };

    if (editMode) {
      const updatedContacts = contactsData.map(ct => ct.id === editContact.id ? contact : ct);
      setContactsData(updatedContacts);
      setFilteredContacts(updatedContacts);
    } else {
      setContactsData([...contactsData, contact]);
      setFilteredContacts([...filteredContacts, contact]);
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
    const updatedContacts = contactsData.filter(contact => contact.id !== id);
    setContactsData(updatedContacts);
    setFilteredContacts(updatedContacts);
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
