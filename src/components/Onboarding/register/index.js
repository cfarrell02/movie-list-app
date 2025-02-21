import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Input, Container,useMediaQuery, Alert } from '@mui/material';

const Register = ({ handleRegister, addAlert }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!password || !secondPassword ||  !firstName || !lastName || !dateOfBirth) {
        throw new Error('Please fill out all fields');
      }else if(password !== secondPassword){
        throw new Error('Passwords do not match');
      }
      await handleRegister(username, password, firstName, lastName, new Date(dateOfBirth));
      addAlert('success', 'User registered');
    } catch (error) {
      addAlert('error', 'Error registering user: ' + error.message);
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 10);

    if (selectedDate <= currentDate) {
      setDateOfBirth(event.target.value);
    } else {
      addAlert('error', 'You must be at least 10 years old to register');
    }
  };

  return (
    <Container maxWidth={isMobile ? '100%' : 'md'} sx={{ mt: 4 }}>
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
        {(password !== secondPassword || !password || !secondPassword) && (
          <Alert severity="info" sx={{ width: '100%' }}>
            Please ensure password matches the confirm password field
          </Alert>
        )}
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
          onChange={handleDateChange}
        />
        <Button variant="contained" type="submit" color="primary">
          Register
        </Button>
      </Box>
      </Container>
  );
};

export default Register;
