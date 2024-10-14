import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ContactList from '../components/ContactList';
import axios from 'axios';

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const Contactos = () => {
  const [practitioners, setPractitioners] = useState([]);
  const [filteredPractitioners, setFilteredPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [cargo, setCargo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para el modal de agregar/editar contacto
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);

  // Estado del formulario de contacto
  const [newContact, setNewContact] = useState({
    familyName: '',
    givenName: '',
    identifier: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    gender: '',
    birthDate: '',
    qualification: '',
    qualificationIssuer: ''
  });

  // Cargar los practitioners desde el servidor
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fhir/Practitioner');
        const practitionersData = response.data.entry.map(entry => entry.resource);
        setPractitioners(practitionersData);
        setFilteredPractitioners(practitionersData);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    fetchPractitioners();
  }, []);

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = practitioners;

    if (cargo) {
      filtered = filtered.filter(practitioner => 
        practitioner.qualification?.some(q => q.code?.text?.toLowerCase().includes(cargo.toLowerCase()))
      );
    }

    if (especialidad) {
      filtered = filtered.filter(practitioner => 
        practitioner.qualification?.some(q => q.code?.text?.toLowerCase().includes(especialidad.toLowerCase()))
      );
    }

    if (establecimiento) {
      filtered = filtered.filter(practitioner => 
        practitioner.address?.some(a => a.city?.toLowerCase().includes(establecimiento.toLowerCase()))
      );
    }

    setFilteredPractitioners(filtered);
  };

  // Búsqueda
  useEffect(() => {
    let filtered = practitioners;

    if (searchQuery) {
      filtered = filtered.filter(practitioner => 
        normalizeString(practitioner.name?.[0]?.given?.join(' ') || '').includes(normalizeString(searchQuery)) ||
        normalizeString(practitioner.name?.[0]?.family || '').includes(normalizeString(searchQuery))
      );
    }

    setFilteredPractitioners(filtered);
  }, [searchQuery, practitioners]);

  // Resetear filtros
  const resetFilters = () => {
    setCargo('');
    setEspecialidad('');
    setEstablecimiento('');
    setSearchQuery('');
    setFilteredPractitioners(practitioners);
  };

  // Manejo del modal de agregar/editar contacto
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingContactId(null);
    // Resetear el formulario
    setNewContact({
      familyName: '',
      givenName: '',
      identifier: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      gender: '',
      birthDate: '',
      qualification: '',
      qualificationIssuer: ''
    });
  };

  // Actualizar estado del formulario de contacto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  // Abrir el modal en modo de edición
  const handleEditClick = (contact) => {
    setIsEditing(true);
    setEditingContactId(contact.id);
    setNewContact({
      familyName: contact.name?.[0]?.family || '',
      givenName: contact.name?.[0]?.given?.join(' ') || '',
      identifier: contact.identifier?.[0]?.value || '',
      phone: contact.telecom?.find(t => t.system === 'phone')?.value || '',
      address: contact.address?.[0]?.line?.[0] || '',
      city: contact.address?.[0]?.city || '',
      postalCode: contact.address?.[0]?.postalCode || '',
      country: contact.address?.[0]?.country || '',
      gender: contact.gender || '',
      birthDate: contact.birthDate || '',
      qualification: contact.qualification?.[0]?.code?.text || '',
      qualificationIssuer: contact.qualification?.[0]?.issuer?.display || ''
    });
    handleOpen();
  };

  // Agregar o editar contacto
  const handleSubmit = async () => {
    const practitionerData = {
      resourceType: 'Practitioner',
      identifier: [{ use: 'official', value: newContact.identifier }],
      active: true,
      name: [
        {
          family: newContact.familyName,
          given: newContact.givenName.split(' ')
        }
      ],
      telecom: [
        { system: 'phone', value: newContact.phone }
      ],
      address: [
        {
          line: [newContact.address],
          city: newContact.city,
          postalCode: newContact.postalCode,
          country: newContact.country
        }
      ],
      gender: newContact.gender,
      birthDate: newContact.birthDate,
      qualification: [
        {
          code: { text: newContact.qualification },
          issuer: { display: newContact.qualificationIssuer }
        }
      ]
    };

    try {
      if (isEditing && editingContactId) {
        // Actualizar contacto existente
        const response = await axios.put(`http://localhost:8080/fhir/Practitioner/${editingContactId}`, practitionerData, {
          headers: { 'Content-Type': 'application/fhir+json' }
        });

        if (response.status === 200) {
          const updatedPractitioner = response.data;
          const updatedPractitioners = practitioners.map(p =>
            p.id === updatedPractitioner.id ? updatedPractitioner : p
          );
          setPractitioners(updatedPractitioners);
          setFilteredPractitioners(updatedPractitioners);
        }
      } else {
        // Agregar nuevo contacto
        const response = await axios.post('http://localhost:8080/fhir/Practitioner', practitionerData, {
          headers: { 'Content-Type': 'application/fhir+json' }
        });

        if (response.status === 201) {
          const createdPractitioner = response.data;
          const updatedPractitioners = [...practitioners, createdPractitioner];
          setPractitioners(updatedPractitioners);
          setFilteredPractitioners(updatedPractitioners);
        }
      }

      handleClose();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  // Eliminar contacto
  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/fhir/Practitioner/${id}`);
      const updatedPractitioners = practitioners.filter(p => p.id !== id);
      setPractitioners(updatedPractitioners);
      setFilteredPractitioners(updatedPractitioners);
    } catch (error) {
      console.error('Error al eliminar el contacto:', error);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Contactos</h1>

      {/* Botón para abrir el formulario de agregar contacto */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Contacto
      </Button>

      {/* Modal con el formulario de agregar/editar contacto */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Apellido" name="familyName" value={newContact.familyName} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Nombres" name="givenName" value={newContact.givenName} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Número de Identificación" name="identifier" value={newContact.identifier} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Teléfono" name="phone" value={newContact.phone} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Dirección" name="address" value={newContact.address} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Ciudad" name="city" value={newContact.city} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Código Postal" name="postalCode" value={newContact.postalCode} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="País" name="country" value={newContact.country} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Género"
                name="gender"
                value={newContact.gender}
                onChange={handleInputChange}
                fullWidth
                select
              >
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Femenino</MenuItem>
                <MenuItem value="other">Otro</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                value={newContact.birthDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Calificación" name="qualification" value={newContact.qualification} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Emisor de la Calificación" name="qualificationIssuer" value={newContact.qualificationIssuer} onChange={handleInputChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Contenedor para los filtros y la lista */}
      <Grid container spacing={2}>
        {/* Bloque de Filtros (Izquierda) */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ paddingRight: '20px' }}>
            <h2>Filtros</h2>

            {/* Filtros */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField select label="Cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} fullWidth>
                  <MenuItem value="">Cargo</MenuItem>
                  <MenuItem value="Médico">Médico</MenuItem>
                  <MenuItem value="Contralor">Contralor</MenuItem>
                  <MenuItem value="Priorizador">Priorizador</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField select label="Especialidad" value={especialidad} onChange={(e) => setEspecialidad(e.target.value)} fullWidth>
                  <MenuItem value="">Especialidad</MenuItem>
                  <MenuItem value="Cardiología">Cardiología</MenuItem>
                  <MenuItem value="Ginecología">Ginecología</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField select label="Establecimiento" value={establecimiento} onChange={(e) => setEstablecimiento(e.target.value)} fullWidth>
                  <MenuItem value="">Establecimiento</MenuItem>
                  <MenuItem value="Star City">Star City</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Buscar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" onClick={applyFilters}>
                  Aplicar Filtros
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="secondary" onClick={resetFilters}>
                  Limpiar Filtros
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Bloque de Contactos (Derecha) */}
        <Grid item xs={12} sm={8}>
          <h2>Lista de Contactos</h2>
          <ContactList
            practitioners={filteredPractitioners}
            onDelete={handleDeleteContact}
            onEdit={handleEditClick}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contactos;
