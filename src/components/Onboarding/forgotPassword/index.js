import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const ForgotPassword = ({sendPasswordResetEmail, addAlert}) => {
  const [email, setEmail] = useState('');


  const handleSubmit = async (event) => {
    // console.log('sendPasswordResetEmail', sendPasswordResetEmail.sendPasswordResetEmail)
    event.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      addAlert('success', 'Reset link sent');
    } catch (error) {
      addAlert('error', 'Error sending reset link: ' + error.message);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1">Reset password</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>We'll email you a link to choose a new password.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button variant="contained" type="submit" size="large">
          Send reset link
        </Button>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
