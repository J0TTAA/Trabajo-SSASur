import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';

const DoctorCard = ({ name, specialty, hospital }) => {
  return (
    <Card variant="outlined" style={{ margin: '10px' }}>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography color="textSecondary">{specialty}</Typography>
        <Typography color="textSecondary">{hospital}</Typography>
      </CardContent>
      <CardActions>
        <IconButton>
          <EmailIcon />
        </IconButton>
        <IconButton>
          <InfoIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
