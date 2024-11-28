import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ContactList from '../components/ContactList';
import axios from 'axios';

/**
 * Normaliza una cadena de texto, eliminando acentos y convirtiéndola a minúsculas.
 * @param {string} str - La cadena de texto a normalizar.
 * @returns {string} - La cadena normalizada, sin acentos y en minúsculas.
 */
const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const Contactos = () => {
  // Estado para almacenar la lista de practitioners (contactos)
  const [practitioners, setPractitioners] = useState([]);
  // Estado que almacena los contactos filtrados después de aplicar filtros de búsqueda
  const [filteredPractitioners, setFilteredPractitioners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// Estados que controlan los filtros disponibles en la vista
  const [cargo, setCargo] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState([]);

  // Estado para el modal de agregar/editar contacto
  // Estado que controla la apertura y cierre del modal para agregar o editar un contacto
  const [open, setOpen] = useState(false);
  // Estado que define si el modal está en modo de edición o creación de contacto
  const [isEditing, setIsEditing] = useState(false);
  // Estado que almacena el contacto que se está editando (si aplica)
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
    qualificationIssuer: '',
    email: '' 
  });

   /**
   * Cargar los practitioners desde el servidor FHIR.
   */
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fhir/Practitioner');
        const practitionersData = response.data.entry.map(entry => entry.resource);
        setPractitioners(practitionersData);
        setFilteredPractitioners(practitionersData);
      } catch (error) {
        console.error('Error al cargar los practitioners:', error);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchPractitioners();
    /**
     * Cargar los establecimientos desde el servidor FHIR.
     */
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fhir/Location');
        const locationData = response.data.entry.map(entry => entry.resource);
        setLocations(locationData);
      } catch (error) {
        console.error('Error al cargar los establecimientos:', error);
      }
    };
    fetchLocations();
  }, []);

  /**
   * Aplicar los filtros a la lista de practitioners.
   */
  const applyFilters = () => {
    let filtered = practitioners;
  // Filtro por cargo
    if (cargo) {
      filtered = filtered.filter(practitioner => 
        practitioner.qualification?.some(q => q.code?.text?.toLowerCase().includes(cargo.toLowerCase()))
      );
    }
  // Filtro por especialidad
    if (especialidad) {
      filtered = filtered.filter(practitioner => 
        practitioner.qualification?.some(q => q.code?.text?.toLowerCase().includes(especialidad.toLowerCase()))
      );
    }
  // Filtro por establecimiento
    if (establecimiento) {
      filtered = filtered.filter(practitioner => 
        practitioner.address?.some(a => 
          normalizeString(a.city || '').includes(normalizeString(establecimiento)) ||
          a.line?.some(line => normalizeString(line).includes(normalizeString(establecimiento)))
        )
      );
    }
  
    setFilteredPractitioners(filtered);
  };

    /**
   * Realizar la búsqueda de contactos basados en el nombre.
   */
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

  /**
   * Resetear los filtros a sus valores iniciales.
   */
  const resetFilters = () => {
    setCargo('');
    setEspecialidad('');
    setEstablecimiento('');
    setSearchQuery('');
    setFilteredPractitioners(practitioners);
  };

/**
   * Abrir el modal de agregar/editar contacto.
   */
  const handleOpen = () => setOpen(true);
  /**
   * Cerrar el modal y resetear el estado.
   */
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
      qualificationIssuer: '',
      email: ''
    });
  };

    /**
   * Manejar el cambio de valor en el formulario.
   * @param {object} e - El evento de cambio.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

    /**
   * Abrir el modal en modo de edición.
   * @param {object} contact - El contacto que se desea editar.
   */
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
    qualificationIssuer: contact.qualification?.[0]?.issuer?.display || '',
    email: contact.telecom?.find(t => t.system === 'email')?.value || '' // Aquí agregamos el email
  });
  handleOpen();
};

  /**
   * Agregar o editar un contacto en el servidor FHIR.
   */
  const handleSubmit = async () => {
    const practitionerData = {
      resourceType: 'Practitioner',
      identifier: [{ use: 'official', value: newContact.identifier }],
      active: true,
      name: [
        {
          family: newContact.familyName,
          given: newContact.givenName ? newContact.givenName.split(' ') : []
        }
      ],
      telecom: [
        { system: 'phone', value: newContact.phone },
        { system: 'email', value: newContact.email } // Agregar email aquí
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
          issuer: {
            reference: 'Organization/1', // Ajusta según sea necesario
            display: newContact.qualificationIssuer
          }
        }
      ]
    };
  
    try {
      if (isEditing && editingContactId) {
        const patchData = [
          newContact.familyName && { op: "replace", path: "/name/0/family", value: newContact.familyName },
          newContact.givenName && { op: "replace", path: "/name/0/given", value: newContact.givenName.split(' ') },
          newContact.phone && { op: "replace", path: "/telecom/0/value", value: newContact.phone },
          newContact.email && { op: "replace", path: "/telecom/1/value", value: newContact.email }, // Email para editar
          newContact.address && { op: "replace", path: "/address/0/line/0", value: newContact.address },
          newContact.city && { op: "replace", path: "/address/0/city", value: newContact.city },
          newContact.postalCode && { op: "replace", path: "/address/0/postalCode", value: newContact.postalCode },
          newContact.country && { op: "replace", path: "/address/0/country", value: newContact.country },
          newContact.gender && { op: "replace", path: "/gender", value: newContact.gender },
          newContact.birthDate && { op: "replace", path: "/birthDate", value: newContact.birthDate },
          newContact.qualification && { op: "replace", path: "/qualification/0/code/text", value: newContact.qualification },
          newContact.qualificationIssuer && { op: "replace", path: "/qualification/0/issuer/display", value: newContact.qualificationIssuer }
        ].filter(Boolean);
  
        const response = await axios.patch(
          `http://localhost:8080/fhir/Practitioner/${editingContactId}`,
          patchData,
          { headers: { 'Content-Type': 'application/json-patch+json' } }
        );
  
        if (response.status === 200) {
          const updatedPractitioner = response.data;
          const updatedPractitioners = practitioners.map(p =>
            p.id === updatedPractitioner.id ? updatedPractitioner : p
          );
          setPractitioners(updatedPractitioners);
          setFilteredPractitioners(updatedPractitioners);
        }
      } else {
        const response = await axios.post(
          'http://localhost:8080/fhir/Practitioner',
          practitionerData,
          { headers: { 'Content-Type': 'application/fhir+json' } }
        );
  
        if (response.status === 201) {
          const createdPractitioner = response.data;
          const updatedPractitioners = [...practitioners, createdPractitioner];
          setPractitioners(updatedPractitioners);
          setFilteredPractitioners(updatedPractitioners);
        }
      }
  
      handleClose();
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
    }
  };
  
  

   /**
   * Eliminar un contacto.
   * @param {string} contactId - El ID del contacto que se desea eliminar.
   */
   const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/fhir/Practitioner/${id}`);
      const updatedPractitioners = practitioners.filter((p) => p.id !== id);
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
      <TextField
        label="Apellido"
        name="familyName"
        value={newContact.familyName}
        onChange={handleInputChange}
        fullWidth
        required
        error={!newContact.familyName.trim()}
        helperText={!newContact.familyName.trim() ? 'Este campo es obligatorio' : ''}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Nombre"
        name="givenName"
        value={newContact.givenName}
        onChange={handleInputChange}
        fullWidth
        required
        error={!newContact.givenName.trim()}
        helperText={!newContact.givenName.trim() ? 'Este campo es obligatorio' : ''}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Correo Electrónico"
        name="email"
        value={newContact.email}
        onChange={handleInputChange}
        fullWidth
        required
        type="email"
        error={!/\S+@\S+\.\S+/.test(newContact.email)}
        helperText={
          !/\S+@\S+\.\S+/.test(newContact.email) ? 'Ingrese un correo electrónico válido' : ''
        }
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        label="Teléfono"
        name="phone"
        value={newContact.phone}
        onChange={handleInputChange}
        fullWidth
        required
        error={!/^\d{7,10}$/.test(newContact.phone)}
        helperText={
          !/^\d{7,10}$/.test(newContact.phone) ? 'Ingrese un teléfono válido (7-10 dígitos)' : ''
        }
      />
    </Grid>
            <Grid item xs={12}>
      <TextField
        select
        label="Establecimiento"
        value={newContact.city}
        onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
        fullWidth
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 200, // Altura máxima del menú desplegable
                width: 250      // Ancho del menú desplegable
              },
            },
          },
        }}
      >
        <MenuItem value="">Selecciona un Establecimiento</MenuItem>
        {locations.map(location => (
          <MenuItem key={location.id} value={location.name}>
            {location.name}
          </MenuItem>
        ))}
      </TextField>
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
    select
    label="Cargo"
    name="qualification"
    value={newContact.qualification}
    onChange={handleInputChange}
    fullWidth
    SelectProps={{
      MenuProps: {
        PaperProps: {
          sx: {
            maxHeight: 200, // Altura máxima del menú desplegable
            width: 250      // Ancho del menú desplegable
          },
        },
      },
    }}
  >
    <MenuItem value="">Selecciona un Cargo</MenuItem>
    <MenuItem value="Médico">Médico</MenuItem>
    <MenuItem value="Contralor">Contralor</MenuItem>
    <MenuItem value="Priorizador">Priorizador</MenuItem>
  </TextField>
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
  <TextField
    select
    label="Establecimiento"
    value={establecimiento}
    onChange={(e) => setEstablecimiento(e.target.value)}
    fullWidth
    SelectProps={{
      MenuProps: {
        PaperProps: {
          sx: {
            maxHeight: 200, // Altura máxima del menú desplegable
            width: 250,     // Ancho del menú desplegable
          },
        },
      },
    }}
  >
    <MenuItem value="">Establecimiento</MenuItem>
    {locations.map(location => (
      <MenuItem key={location.id} value={location.name}>
        {location.name}
      </MenuItem>
    ))}
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