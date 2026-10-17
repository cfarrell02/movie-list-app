import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const Login = ({ handleLogin, addAlert }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      addAlert('error', 'Please fill out all fields');
      return;
    }

    try {
      await handleLogin(username, password);
      addAlert('success', 'Logged in');
    } catch (error) {
      addAlert('error', 'Error logging in: ' + error.message);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1">Sign in</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Welcome back – pick up where you left off.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          autoComplete="email"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button variant="contained" type="submit" size="large">
          Sign in
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
