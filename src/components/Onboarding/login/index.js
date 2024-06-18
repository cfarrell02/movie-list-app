import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const Login = ({ handleLogin, setError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleLogin(username, password);
      setError({ message: 'Logged in', severity: 'success' });
    } catch (error) {
      setError({ message: error.message, severity: 'error' });
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextField
          label="Email"
          variant="outlined"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button variant="contained" type="submit" color="primary">
          Login
        </Button>
      </Box>
    </>
  );
};

export default Login;
