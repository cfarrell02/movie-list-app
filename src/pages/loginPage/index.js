import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, Alert, Switch, useMediaQuery, Divider } from '@mui/material';
import { onAuthStateChanged, sendPasswordResetEmail, updateEmail, updatePassword, deleteUser } from 'firebase/auth';
import { auth } from '../../firebase-config';
import Register from '../../components/Onboarding/register';
import ForgotPassword from '../../components/Onboarding/forgotPassword';
import { SiteDataContext } from '../../contexts/siteDataContext';
import { getUserById, updateUser } from '../../api/userDataStorage';
import UpdateProfile from '../../components/Onboarding/updateProfile';
import { AlertContext } from '../../contexts/alertContext';
import Login from '../../components/Onboarding/login';
import { Link } from 'react-router-dom';

const LoginPage = ({ handleLogin, handleRegister, handleLogout, updateThemeProvider }) => {
  const [user, setUser] = useState(null);
  const [pageState, setPageState] = useState('login');
  const {addAlert} = React.useContext(AlertContext);
  const { adultContent, setAdultContent, darkMode, setDarkMode} = React.useContext(SiteDataContext);
  const [showAdultContentSettings, setShowAdultContentSettings] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserById(user.uid);
        user = {...user, ...userData};
        setUser(user);
      } else {
        setUser(null);
      }
    });

  }, []);

  const handleToggle = () => {
    setPageState(pageState === 'login' ? 'register' : 'login');
  };

  const toggleAdultContent = async (event) => {
    setAdultContent(event.target.checked);
    localStorage.setItem('adultContent', event.target.checked);

    const userData = await getUserById(user.uid);
    userData.adultAllowed = event.target.checked;
    await updateUser(user.uid,userData);
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
      addAlert('success', 'Password reset email sent');
    } catch (error) {
      throw new Error('Error sending password reset email: ' + error.code);
    }
  }

  return (
    <Card
      
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: (isMobile ? '1em 0' : '2em'),
        margin: '1em 5%',
      }}
    >
      <Typography variant={isMobile ? 'h5':'h2'} component="h1" align="center" sx={{ color: 'text.primary' }}>
        Welcome {user && user.firstName}!
      </Typography>

      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'auto',
          width: '100%', // Make the container wider
          padding: (isMobile ? '1em 0' : '1em'),
        }}
      >
        {user === null ? (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1em 2em 1em' }}>
          {
          pageState === 'login' ? (
            <Login handleLogin={handleLogin} addAlert={addAlert} />
          ) : (
            pageState === 'forgotPassword' ? (
              <ForgotPassword sendPasswordResetEmail={sendPasswordEmail} addAlert={addAlert} />
            ) : (
              <Register handleRegister={handleRegister} addAlert={addAlert} />
            )
          )}
          </Container>
        ) : (
          <> {/*Logged in section*/}
            <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1em 2em 1em' }}>
              <UpdateProfile updateEmail={updateEmail} deleteUserAuth={deleteUser} reAuthenticate={handleLogin} />
            </Container>


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
      </Container>

      <Container sx={{ marginTop: '1em', flexDirection: 'column', display: 'flex', alignItems: 'center', padding: '0 1em 2em 1em' }}>
        <Divider sx={{ width: '100%', marginBottom: '1em' }}/>

        {user && <Button onClick={() => setShowAdultContentSettings(!showAdultContentSettings)} sx={{ margin: '2em 0 0 0'}}/> } 

        <Typography variant="h5" component="p" sx={{ marginBottom: '1em' }}>Settings</Typography>
        {/*Universal settings*/}
        
        <Typography variant="h6" component="p" sx={{ marginBottom: '.2em' }}>Toggle Theme</Typography>
        <Switch onChange={toggleTheme} checked={darkMode} />
        {user && user.admin && (
              <Link to="/admin" style={{ textDecoration: 'none' }}>
                <Button variant="contained" size="large" color="primary" sx={{ mt: 2 }}>
                  Admin
                </Button>
              </Link>
            )}

        {user && (<>
          {/*Logged in specific settings*/}
          {showAdultContentSettings && (<>
          <Typography variant="h6" component="p" sx={{ marginBottom: '.2em' }}>Adult Content 🌶️ </Typography>
          <Switch onChange={toggleAdultContent} checked={adultContent} />
          </>)}
        </>)}
      </Container>
    </Card>
  );
};

export default LoginPage;
