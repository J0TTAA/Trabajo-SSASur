import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FFFF'
      }}>
        <img src="https://www.ssbiobio.cl/public/images/logos/logo_gob_jpg.jpg" alt="Logo" style={{ 
          maxWidth: '100px', 
          height: 'auto',   
          marginRight: '10px' 
        }} />
        <Typography variant="h6" style={{ flexGrow: 1, color: 'black' }}>
          Servicio de Salud ARAUCANIA SUR
        </Typography>
        <Button component={Link} to="/contactos" style={{ color: 'black' }}>Contactos</Button>
        <Button component={Link} to="/protocolos" style={{ color: 'black' }}>Protocolos</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
