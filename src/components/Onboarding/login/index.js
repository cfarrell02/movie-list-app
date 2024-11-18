import React, { useState } from 'react';
import { Box, TextField, Button, Typography , Container, useMediaQuery} from '@mui/material';
import { SiteDataContext } from '../../../contexts/siteDataContext';
import { getUserById } from '../../../api/userDataStorage';

const Login = ({ handleLogin, addAlert }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {adultContent, setAdultContent} = React.useContext(SiteDataContext);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      addAlert('error', 'Please fill out all fields');
      return;
    }

    try {
      const result = await handleLogin(username, password);
      const userData = await getUserById(result.user.uid);
      setAdultContent(userData.adultAllowed);
      localStorage.setItem('adultContent', userData.adultAllowed);
      addAlert('success', 'Logged in');
    } catch (error) {
      addAlert('error', 'Error logging in: ' + error.message);
    }
  };

  return (
    <Container maxWidth={isMobile ? '100%' : 'md'} sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
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
    </Container>
  );
};

export default Login;
