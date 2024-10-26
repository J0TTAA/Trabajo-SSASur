import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import ConditionCard from './ConditionCard';

const ConditionList = ({ conditions, onDelete, onEdit }) => {
  return (
    <Grid container spacing={2}>
      {conditions.map(condition => (
        <Grid item xs={12} sm={6} md={4} key={condition.id}>
          <ConditionCard 
            condition={condition} 
            onDelete={onDelete} 
            onEdit={onEdit} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

ConditionList.propTypes = {
  conditions: PropTypes.arrayOf(PropTypes.object).isRequired,  // Cambié 'practitioners' a 'conditions'
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ConditionList;

