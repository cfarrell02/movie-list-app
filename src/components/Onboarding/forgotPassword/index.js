import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, useMediaQuery } from '@mui/material';

const ForgotPassword = ({sendPasswordResetEmail, addAlert}) => {
  const [email, setEmail] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');


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
    <Container maxWidth={isMobile ? '100%' : 'md'} sx={{ mt: 4 }}>
      <Typography variant={isMobile ? 'h5':"h4"} component="h1" sx={{ mb: 4 }}>
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
    </Container>
  );
};

export default ForgotPassword;
