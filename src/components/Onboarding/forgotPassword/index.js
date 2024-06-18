import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

const ForgotPassword = ({sendPasswordResetEmail, setError}) => {
  const [email, setEmail] = useState('');


  const handleSubmit = async (event) => {
    // console.log('sendPasswordResetEmail', sendPasswordResetEmail.sendPasswordResetEmail)
    event.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      setError({ message: 'Password reset email sent', severity: 'success' });
    } catch (error) {
      setError({ message: error.message, severity: 'error' });
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Forgot Password
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button variant="contained" type="submit" color="primary">
          Send Reset Link
        </Button>
      </Box>
    </>
  );
};

export default ForgotPassword;
