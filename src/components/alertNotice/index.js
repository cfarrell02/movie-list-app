import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Alert } from '@mui/material';
import { AlertContext } from '../../contexts/alertContext';

const AlertNotice = () => {
  const {alerts} = useContext(AlertContext); // Access alerts from the context


  return (
    alerts.slice(0, 5).map((alert, index) => (
      <Alert
        key={index} // Adding a key to each alert for React's internal tracking
        severity={alert.severity}
        sx={{
          maxWidth: '40%',
          position: 'fixed',
          right: '2%',
          bottom: `${index * 8 + 2}%`,
          zIndex: 1000
        }}
      >
        {alert.message}
      </Alert>
    ))
  );
};

export default AlertNotice;


