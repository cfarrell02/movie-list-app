import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const Register = ({ handleRegister, addAlert }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!username || !password || !secondPassword || !firstName || !lastName || !dateOfBirth) {
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

  const passwordsMismatch = secondPassword.length > 0 && password !== secondPassword;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" component="h1">Create account</Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>Start tracking what you watch.</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="First name"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <TextField
            fullWidth
            label="Last name"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </Box>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={secondPassword}
          error={passwordsMismatch}
          helperText={passwordsMismatch ? 'Passwords do not match' : ' '}
          onChange={(event) => setSecondPassword(event.target.value)}
        />
        <Button variant="contained" type="submit" size="large">
          Create account
        </Button>
      </Box>
    </Box>
  );
};

export default Register;
