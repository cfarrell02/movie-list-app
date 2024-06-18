import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Input } from '@mui/material';

const Register = ({ handleRegister, setError }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    if (password !== secondPassword) {
      setError({ message: 'Passwords do not match', severity: 'error' });
    } else {
      setError({ message: '', severity: '' });
    }
  }, [password, secondPassword, setError]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (password !== secondPassword || !firstName || !lastName || !dateOfBirth) throw new Error('Please fill out all fields');
      await handleRegister(username, password, firstName, lastName, dateOfBirth);
      setError({ message: 'Registered', severity: 'success' });
    } catch (error) {
      setError({ message: error.message, severity: 'error' });
    }
  };

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Register
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
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={secondPassword}
          onChange={(event) => setSecondPassword(event.target.value)}
        />
        <TextField
          label="First Name"
          variant="outlined"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
        <Input
          type="date"
          value={dateOfBirth}
          onChange={(event) => {
            const selectedDate = new Date(event.target.value);
            const currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() - 10);

            if (selectedDate <= currentDate) {
              setDateOfBirth(event.target.value);
            } else {
              setError({ message: 'You must be at least 10 years old to register', severity: 'error' });
            }
          }}
        />
        <Button variant="contained" type="submit" color="primary">
          Register
        </Button>
      </Box>
    </>
  );
};

export default Register;
