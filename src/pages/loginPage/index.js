import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Card, Alert, Input, Grid} from '@mui/material';
import { Switch } from '@mui/material';
import {auth} from '../../firebase-config';
import { onAuthStateChanged } from "firebase/auth";

const LoginPage = ({ handleLogin, handleRegister , handleLogout, toggleTheme, theme}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [user , setUser] = useState(null);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  
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

  useEffect(() => {
    if(password !== secondPassword && !isLogin){
        setError('Passwords do not match');
    }else{
        setError('');
    }
  }, [password, secondPassword]);
 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isLogin) {
        await handleLogin(username, password);
      } else {
        if(password !== secondPassword || !firstName || !lastName || !dateOfBirth) throw new Error('Please fill out all fields')
        await handleRegister(username, password, firstName, lastName, dateOfBirth);
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
        marginBottom: '8rem',
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
          height: isLogin ? '40vh' : '60vh',
          width: isLogin ? '30vh' : '50vh',
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
          {isLogin ? null :
          (
            <>
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={secondPassword}
            onChange={(event) => setSecondPassword(event.target.value)}
          />
          <TextField
           label = 'First Name'
            variant = 'outlined'
            type = 'text'
            value = {firstName}
            onChange = {(event) => setFirstName(event.target.value)}
          />
          <TextField
            label = 'Last Name'
            variant = 'outlined'
            type = 'text'
            value = {lastName}
            onChange = {(event) => setLastName(event.target.value)}
          />
            <Input
              type='date'
              value={dateOfBirth}
              onChange={(event) => {
                const selectedDate = new Date(event.target.value);
                const currentDate = new Date();
                currentDate.setFullYear(currentDate.getFullYear() - 10);

                if (selectedDate <= currentDate) {
                  setDateOfBirth(event.target.value);
                } else {
                  // Handle invalid date error or provide feedback to the user
                  setError('You must be at least 10 years old to register');
                }
              }}
            />

          </>
          )}
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

      <Card sx={{marginTop:'2em', flexDirection:'column', display:'flex', alignItems:'center', padding:'1em'}} >
        <Typography variant="h6" component="p" sx={{marginBottom:'1em'}}>Toggle Theme</Typography>
        <Switch onChange={toggleTheme} checked={theme === 'dark'}/>
      </Card>
    </Container>
  );
};

export default LoginPage;
