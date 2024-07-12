import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SearchFilters = ({ label, options, value, onChange }) => {
  return (
    <FormControl variant="outlined" style={{ margin: '10px', minWidth: 200 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SearchFilters;
