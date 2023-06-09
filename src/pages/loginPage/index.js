import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Card, fabClasses} from '@mui/material';

const LoginPage = (handleLogin, handleRegister) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login or register logic here
    console.log('Username:', username);
    console.log('Password:', password);
    if(isLogin)
    handleLogin(username, password);
    else
    handleRegister(username, password);

  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome!
        </Typography>
        <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '35vh', width:'30vh', padding: '2rem' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        {isLogin ? 'Login' : 'Register'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <TextField
          label="Username"
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
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </Box>
      <Button onClick={handleToggle} sx={{ mt: 2 }}>
        {isLogin ? 'Register' : 'Login'}
      </Button>
        </Card>
    </Container>
  );
};

export default LoginPage;
