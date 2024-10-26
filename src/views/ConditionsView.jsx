import React, { useEffect, useState } from 'react';
import { Button, TextField, MenuItem, Grid, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ConditionList from '../components/ConditionList';
import axios from 'axios';

const Conditions = () => {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredconditions, setFilteredConditions] = useState([]);
  const [error, setError] = useState(null);  

// Filtros
const [observaciones, setObservaciones] = useState('');
const [criterios, setCriterios] = useState('');
const [searchQuery, setSearchQuery] = useState('');

  // Estado para el modal de agregar/editar condition
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingConditionId, setEditingConditionId] = useState(null);

  // Estado del formulario de condition
  const [newCondition, setNewCondition] = useState({
    patologia: '',
    observaciones: '',
    criterios: '',
    examenes: ''
  });

  // Cargar las condiciones desde el servidor
  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/fhir/Condition');
        const conditionsData = response.data.entry.map(entry => entry.resource);
        setConditions(conditionsData);
        setFilteredConditions(conditionsData);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los datos');
        setLoading(false);
      }
    };
    fetchConditions();
  }, []);
  // Aplicar filtros
const applyFilters = () => {
    let filtered = conditions;
  
    if (observaciones) {
      filtered = filtered.filter(condition =>
        condition.note?.some(n => n.text?.toLowerCase().includes(observaciones.toLowerCase()))
      );
    }
  
    if (criterios) {
      filtered = filtered.filter(condition =>
        condition.stage?.some(s => s.summary?.text?.toLowerCase().includes(criterios.toLowerCase()))
      );
    }
  
    setFilteredConditions(filtered); 
  };
  



  // Búsqueda
  useEffect(() => {
    let filtered = conditions; 
  
    if (searchQuery) {
      filtered = filtered.filter(condition => 
        normalizeString(condition.code?.text || '').includes(normalizeString(searchQuery)) ||
        condition.note?.some(n => normalizeString(n.text || '').includes(normalizeString(searchQuery))) ||
        condition.stage?.some(s => normalizeString(s.summary?.text || '').includes(normalizeString(searchQuery)))  
      );
    }
  
    setFilteredConditions(filtered);
  }, [searchQuery, conditions]);
  


 // Resetear filtros
    const resetFilters = () => {
    setObservaciones(''); 
    setCriterios('');   
    setSearchQuery('');  
    setFilteredConditions(conditions);
  };
  


  // Manejo del modal de agregar/editar condition
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingConditionId(null);
    // Resetear el formulario
    setNewCondition({
      patologia: '',
      observaciones: '',
      criterios: '',
      examenes: ''
    });
  };

  // Actualizar estado del formulario de condition
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCondition({ ...newCondition, [name]: value });
  };

   // Abrir el modal en modo de edición
  const handleEditClick = (condition) => {
    setIsEditing(true);
    setEditingConditionId(condition.id); 
    setNewCondition({
      code: condition.code?.text || '', 
      observaciones: condition.note?.map(n => n.text) || [], 
      criterios: condition.stage?.map(s => s.summary?.text) || [], 
    });
    handleOpen();
  };
  


 // Agregar o editar condición
 const handleSubmit = async () => {
    const conditionData = {
      resourceType: 'Condition',
      code: { text: newCondition.patologia || '' },  // Asegúrate de que patologia está correctamente asignado
      note: Array.isArray(newCondition.observaciones) && newCondition.observaciones.length > 0
        ? newCondition.observaciones.map(text => ({ text })) 
        : [{ text: newCondition.observaciones || '' }], // Si observaciones es un string simple
      stage: [
        {
          summary: { text: newCondition.criterios || '' } // Asegúrate de que criterios esté correctamente asignado
        }
      ],
      // Agrega cualquier otro campo necesario, como exámenes
      // examenes: newCondition.examenes || '' // Si es necesario
    };
  
    try {
      if (isEditing && editingConditionId) {
        // Actualizar condición existente
        const response = await axios.put(`http://localhost:8080/fhir/Condition/${editingConditionId}`, conditionData, {
          headers: { 'Content-Type': 'application/fhir+json' }
        });
  
        if (response.status === 200) {
          const updatedCondition = response.data;
          const updatedConditions = conditions.map(c =>
            c.id === updatedCondition.id ? updatedCondition : c
          );
          setConditions(updatedConditions);
          setFilteredConditions(updatedConditions);
        }
      } else {
        // Agregar nueva condición
        const response = await axios.post('http://localhost:8080/fhir/Condition', conditionData, {
          headers: { 'Content-Type': 'application/fhir+json' }
        });
  
        if (response.status === 201) {
          const createdCondition = response.data;
          const updatedConditions = [...conditions, createdCondition];
          setConditions(updatedConditions);
          setFilteredConditions(updatedConditions);
        }
      }
  
      handleClose();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  
  
  

// Eliminar 
  const handleDeleteCondition = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/fhir/Condition/${id}`);
      const updatedConditions = conditions.filter(p => p.id !== id);
      setConditions(updatedConditions);
      setFilteredConditions(updatedConditions);
    } catch (error) {
      console.error('Error al eliminar el patología:', error);
    }
  };


  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Condiciones</h1>

      {/* Mostrar el botón de agregar condición aunque haya error */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Condición
      </Button>

      {/* Modal con el formulario de agregar/editar condición */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Editar Condición' : 'Agregar Nueva Condición'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Patología" name="patologia" value={newCondition.patologia} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Observaciones" name="observaciones" value={newCondition.observaciones} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Criterios" name="criterios" value={newCondition.criterios} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Exámenes" name="examenes" value={newCondition.examenes} onChange={handleInputChange} fullWidth />
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

      <Grid item xs={12} sm={8}>
          <h2>Lista de Condiciones</h2>
          <ConditionList
            conditions={filteredconditions}
             onDelete={handleDeleteCondition}
            onEdit={handleEditClick}
          />
        </Grid>


    </Box>
  );
};

export default Conditions;
