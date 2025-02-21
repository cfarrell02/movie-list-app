import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Card, Alert, Switch, useMediaQuery, Divider, Grid } from '@mui/material';
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
import { type } from '@testing-library/user-event/dist/type';

const LoginPage = ({ handleLogin, handleRegister, handleLogout, updateThemeProvider }) => {
  const [user, setUser] = useState(null);
  const [pageState, setPageState] = useState('login');
  const { addAlert } = useContext(AlertContext);
  const { adultContent, setAdultContent, darkMode, setDarkMode } = useContext(SiteDataContext);
  const [showAdultContentSettings, setShowAdultContentSettings] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const settings = [
    {
      label: "Toggle Theme",
      action: () => toggleTheme(),
      type: "switch",
      checked: darkMode,
      requiredLogin: false,
      admin: false,
      shown: true,
    },
    {
      label: "Admin",
      to: "/admin",
      type: "link",
      requiredLogin: true,
      admin: true,
      shown: true,
    },
    {
      label: "Adult Content 🌶️",
      action: (event) => toggleAdultContent(event),
      type: "switch",
      checked: adultContent,
      requiredLogin: true,
      admin: false,
      shown: showAdultContentSettings,
    },
  ];
  

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserById(user.uid);
        user = { ...user, ...userData };
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
    await updateUser(user.uid, userData);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? '#f0f0f0' : '#333333';
    localStorage.setItem('isDarkMode', !darkMode);
    updateThemeProvider(!darkMode);
  };

  const handleForgotPassword = () => {
    setPageState('forgotPassword');
  };

  const sendPasswordEmail = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      addAlert('success', 'Password reset email sent');
    } catch (error) {
      throw new Error('Error sending password reset email: ' + error.code);
    }
  };

  const renderAuthSection = () => {
    if (user === null) {
      return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1em 2em 1em' }}>
          {pageState === 'login' ? (
            <Login handleLogin={handleLogin} addAlert={addAlert} />
          ) : pageState === 'forgotPassword' ? (
            <ForgotPassword sendPasswordResetEmail={sendPasswordEmail} addAlert={addAlert} />
          ) : (
            <Register handleRegister={handleRegister} addAlert={addAlert} />
          )}
          <Button onClick={handleToggle} sx={{ mt: 2 }}>
            {pageState === 'login' ? 'Register' : 'Login'}
          </Button>
          {pageState !== 'forgotPassword' && (
            <Button onClick={handleForgotPassword} sx={{ mt: 2 }}>
              Forgot Password?
            </Button>
          )}
        </Container>
      );
    } else {
      return (
      <>
          <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1em 2em 1em' }}>
            <UpdateProfile updateEmail={updateEmail} deleteUserAuth={deleteUser} reAuthenticate={handleLogin} />
          </Container>
          <Button variant="contained" size="large" color="primary" onClick={handleLogout}>
            Logout
          </Button>
      </>
      );
    }
  };

  const renderSettingsSection = () => {
    return (
      <Container
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Divider sx={{ width: "100%", mb: 2 }} />
        <Button onClick={() => setShowAdultContentSettings(!showAdultContentSettings)}>
        </Button>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Settings
        </Typography>
  
        <Grid container spacing={2} justifyContent="center" width="100%">
          {settings
            .filter(
              (setting) =>
                (!setting.requiredLogin || user) &&
                (!setting.admin || (user && user.admin)) &&
                setting.shown
            )
            .sort((a, b) => (a.type === "link" ? 1 : -1))
            .map((setting) => (
              <Grid item xs={12} md={6} lg={4} key={setting.label}>
              <Container
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="h6">{setting.label}</Typography>
                    {getSetting(setting)}
                  </Container>
                    </Grid>
            ))}
        </Grid>
        </Container>
    );
  };

  const getSetting = (setting) => {
    switch (setting.type) {
      case "switch":
        return (
          <Switch
            checked={setting.checked}
            onChange={setting.action}
            inputProps={{ "aria-label": setting.label }}
          />
        );
      case "button":
        return (
          <Button variant="contained" onClick={setting.action}>
            {setting.label}
          </Button>
        );
      case "link":
        return (
          <Link to={setting.to} style={{ textDecoration: "none" }}>
            <Button variant="contained" fullWidth>
              {setting.label}
            </Button>
          </Link>
        );
      default:
        return null;
    }
  }
  

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1em 0' : '2em', margin: '1em 5%' }}>
      {user && !user.active && (
        <Alert severity="warning" sx={{ width: '100%', marginBottom: '1em' }}>
          Your account is not active. Please contact an admin for assistance.
        </Alert>
      )}
      <Typography variant={isMobile ? 'h5' : 'h2'} component="h1" align="center" sx={{ color: 'text.primary' }}>
        Welcome {user && user.firstName}!
      </Typography>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto', width: '100%', padding: isMobile ? '1em 0' : '1em' }}>
        {renderAuthSection()}
      </Container>
      {renderSettingsSection()}
    </Card>
  );
};

export default LoginPage;
