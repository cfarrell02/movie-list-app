import React , {useState} from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Alert } from '@mui/material';

const AlertNotice = (alerts) => {

    return (
        alerts.slice(0,5).map((alert, index) => (
        <Alert severity={alert.severity}
        sx = {{maxWidth: '40%',
        position: 'fixed',
        right: '2%',
        bottom: `${(index) * 8 + 2}%`,
        zIndex: 1000
    }}
        >{alert.message}</Alert>
    )
        
    ))
}
export default AlertNotice;