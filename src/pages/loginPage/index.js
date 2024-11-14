import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, Alert, Switch } from '@mui/material';
import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase-config';
import Login from '../../components/Onboarding/login';
import Register from '../../components/Onboarding/register';
import ForgotPassword from '../../components/Onboarding/forgotPassword';
import { SiteDataContext } from '../../contexts/siteDataContext';

const LoginPage = ({ handleLogin, handleRegister, handleLogout, updateThemeProvider }) => {
  const [user, setUser] = useState(null);
  const [pageState, setPageState] = useState('login');
  const [error, setError] = useState({severity: '', message: ''});
  const { adultContent, setAdultContent, darkMode, setDarkMode} = React.useContext(SiteDataContext);

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
    setPageState(pageState === 'login' ? 'register' : 'login');
  };

  const toggleAdultContent = (event) => {
    setAdultContent(event.target.checked);
    localStorage.setItem('adultContent', event.target.checked);
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    //change background color in css
    if(!darkMode){
      document.body.style.backgroundColor = '#333333'
    }
    else{
      document.body.style.backgroundColor = '#f0f0f0'
    }

    //Add to browser local storage
    localStorage.setItem('isDarkMode', !darkMode);
    updateThemeProvider(!darkMode);
  };

  const handleForgotPassword = () => {
    setPageState('forgotPassword');
  }

  const sendPasswordEmail = async (email) => {
    try {
      console.log('sendPasswordResetEmail', sendPasswordResetEmail)
      await sendPasswordResetEmail(auth, email);
      setError({ message: 'Password reset email sent', severity: 'success' });
    } catch (error) {
      throw new Error('Error sending password reset email: ' + error.code);
    }
  }

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
      <Typography variant="h2" component="h1" align="center" sx={{ mb: 4, color: 'text.primary' }}>
        Welcome! {user && user.email}
      </Typography>

      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'auto',
          width: 'auto',
          padding: '2rem',
        }}
      >
        {user === null ? (
          pageState === 'login' ? (
            <Login handleLogin={handleLogin} setError={setError} />
          ) : (

              pageState === 'forgotPassword' ? (
                  
                  <ForgotPassword sendPasswordResetEmail={sendPasswordEmail} setError={setError} />
              ) : (

              <Register handleRegister={handleRegister} setError={setError} />
              )
          )

          
        ) : (
          <>
          <Button variant="contained" size="large" color="primary" onClick={() => handleLogout()}>
            Logout
          </Button>
          </>
        )}

        {user === null && (
          <>
          <Button onClick={handleToggle} sx={{ mt: 2 }}>
            {pageState === 'login' ? 'Register' : 'Login'}
          </Button>

          {pageState !== 'forgotPassword' && 

          <Button onClick={handleForgotPassword} sx={{ mt: 2 }}>
            Forgot Password?
            </Button>
          }
          </>
        
        )}
      </Card>

      {error.message && (
        <Alert severity={error.severity} sx={{ marginTop: '2em' }}>
          {error.message}
        </Alert>
      )}

      <Card sx={{ marginTop: '2em', flexDirection: 'column', display: 'flex', alignItems: 'center', padding: '1em' }}>
        <Typography variant="h5" component="p" sx={{ marginBottom: '1em' }}>Settings</Typography>
        {/*Universal settings*/}
        
        <Typography variant="h6" component="p" sx={{ marginBottom: '.2em' }}>Toggle Theme</Typography>
        <Switch onChange={toggleTheme} checked={darkMode} />

        {user && (<>
          {/*Logged in specific settings*/}
          <Typography variant="h6" component="p" sx={{ marginBottom: '.2em' }}>Adult Content</Typography>
          <Switch onChange={toggleAdultContent} checked={adultContent} />
        </>)}
      </Card>
    </Container>
  );
};

export default LoginPage;
