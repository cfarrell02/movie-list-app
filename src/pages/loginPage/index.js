import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Card, Alert} from '@mui/material';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from "firebase/auth";

const LoginPage = ({ handleLogin, handleRegister , handleLogout}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user , setUser] = useState(null);
  const [error, setError] = useState('');

  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        } else {
            setUser(null);
        }
    });
    }, []);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isLogin) {
        await handleLogin(username, password);
      } else {
        await handleRegister(username, password);
      }
      setError('');
    } catch (error) {
        setError(error.message);
      // Handle the error and display an error message to the user
    }
  };
  

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
        
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4 }}>
        Welcome! {user ? user.email : null}
      </Typography>
      
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '35vh',
          width: '30vh',
          padding: '2rem',
        }}
      >
        {user===null ? ( <>
        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
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
        </>)
        :(
            <Button variant="contained" size="large" color="primary" onClick={() => handleLogout()}>
            Logout
            </Button>
        )}

      </Card>

      {error !== '' ?
        <Alert severity="error" sx={{marginTop:'2em'}}>{error}</Alert>
        : null}   
    </Container>
  );
};

export default LoginPage;
