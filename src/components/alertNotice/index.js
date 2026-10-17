import React, { useContext } from 'react';
import { Alert, Slide, Stack } from '@mui/material';
import { AlertContext } from '../../contexts/alertContext';

const AlertNotice = () => {
  const { alerts, removeAlert } = useContext(AlertContext);

  return (
    <Stack
      spacing={1}
      sx={{
        position: 'fixed',
        right: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 'auto' },
        bottom: { xs: 16, sm: 24 },
        zIndex: (theme) => theme.zIndex.snackbar,
        maxWidth: { sm: 420 },
      }}
    >
      {alerts.slice(-5).map((alert) => (
        <Slide key={alert.uid} direction="up" in mountOnEnter unmountOnExit>
          <Alert
            variant="filled"
            severity={alert.severity}
            onClose={() => removeAlert(alert.uid)}
            sx={{ boxShadow: 6, alignItems: 'center' }}
          >
            {alert.message}
          </Alert>
        </Slide>
      ))}
    </Stack>
  );
};

export default AlertNotice;
