import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Button, Card, Alert, Switch, Box, Stack, Link as MuiLink } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { onAuthStateChanged, sendPasswordResetEmail, updateEmail, deleteUser } from 'firebase/auth';
import { auth } from '../../firebase-config';
import Register from '../../components/Onboarding/register';
import ForgotPassword from '../../components/Onboarding/forgotPassword';
import { SiteDataContext } from '../../contexts/siteDataContext';
import { getUserById, updateUser } from '../../api/userDataStorage';
import UpdateProfile from '../../components/Onboarding/updateProfile';
import { AlertContext } from '../../contexts/alertContext';
import Login from '../../components/Onboarding/login';
import { Link } from 'react-router-dom';
import { ADULT_AGE, isOfAdultAge } from '../../utils';

const LoginPage = ({ handleLogin, handleRegister, handleLogout }) => {
  const [user, setUser] = useState(null);
  const [pageState, setPageState] = useState('login');
  const { addAlert } = useContext(AlertContext);
  const { adultContent, setAdultContent, darkMode, setDarkMode } = useContext(SiteDataContext);
  const [showAdultContentSettings, setShowAdultContentSettings] = useState(false);

  const settings = [
    {
      label: "Dark mode",
      action: () => toggleTheme(),
      type: "switch",
      checked: darkMode,
      requiredLogin: false,
      admin: false,
      shown: true,
    },
    {
      label: "User management",
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
      // Only offered to signed-in users old enough to use it
      shown: showAdultContentSettings && !!user && isOfAdultAge(user.dateOfBirth),
    },
  ];
  

  useEffect(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        return;
      }
      try {
        const userData = await getUserById(authUser.uid);
        setUser({ ...authUser, ...userData });
      } catch (error) {
        console.error(error);
        setUser({ ...authUser });
      }
    });
  }, []);

  const handleToggle = () => {
    setPageState(pageState === 'login' ? 'register' : 'login');
  };

  const toggleAdultContent = async (event) => {
    const enabled = event.target.checked;
    if (enabled && !isOfAdultAge(user.dateOfBirth)) {
      addAlert('error', `You must be ${ADULT_AGE} or older to enable adult content.`);
      return;
    }
    setAdultContent(enabled);
    try {
      await updateUser(user.uid, { adultAllowed: enabled });
      setUser((current) => ({ ...current, adultAllowed: enabled }));
    } catch (error) {
      console.error(error);
      setAdultContent(!enabled);
      addAlert('error', 'Could not save your adult content setting. Please try again.');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
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
          <Button component={Link} to={setting.to} variant="outlined" size="small">
            Open
          </Button>
        );
      default:
        return null;
    }
  }
  

  const visibleSettings = settings.filter(
    (setting) =>
      (!setting.requiredLogin || user) &&
      (!setting.admin || (user && user.admin)) &&
      setting.shown
  ).sort((a, b) => (a.type === 'link') - (b.type === 'link'));

  const settingsCard = (
    <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h5" component="h2">Preferences</Typography>
        {/* Hidden toggle that reveals the adult content setting */}
        <Button
          aria-hidden
          tabIndex={-1}
          onClick={() => setShowAdultContentSettings(!showAdultContentSettings)}
          sx={{ minWidth: 0, width: 24, height: 24, p: 0, opacity: 0 }}
        />
      </Stack>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />} sx={{ mt: 2 }}>
        {visibleSettings.map((setting) => (
          <Stack key={setting.label} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}>
            <Typography fontWeight={500}>{setting.label}</Typography>
            {getSetting(setting)}
          </Stack>
        ))}
      </Stack>
    </Card>
  );

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={3} sx={{ maxWidth: 460, mx: 'auto' }}>
          <Card sx={{ p: { xs: 3, sm: 5 } }}>
            {pageState === 'login' ? (
              <Login handleLogin={handleLogin} addAlert={addAlert} />
            ) : pageState === 'forgotPassword' ? (
              <ForgotPassword sendPasswordResetEmail={sendPasswordEmail} addAlert={addAlert} />
            ) : (
              <Register handleRegister={handleRegister} addAlert={addAlert} />
            )}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 3 }} flexWrap="wrap" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {pageState === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <MuiLink component="button" variant="body2" fontWeight={600} onClick={handleToggle}>
                  {pageState === 'login' ? 'Create one' : 'Sign in'}
                </MuiLink>
              </Typography>
              {pageState === 'login' && (
                <MuiLink component="button" variant="body2" fontWeight={600} onClick={handleForgotPassword}>
                  Forgot password?
                </MuiLink>
              )}
            </Stack>
          </Card>
          {settingsCard}
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h3" component="h1">Account</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Signed in as {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
            </Typography>
          </Box>
          <Button variant="outlined" color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Log out
          </Button>
        </Stack>
        {!user.active && (
          <Alert severity="warning">Your account is not active. Please contact an admin for assistance.</Alert>
        )}
        {settingsCard}
        <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
          <UpdateProfile updateEmail={updateEmail} deleteUserAuth={deleteUser} reAuthenticate={handleLogin} />
        </Card>
      </Stack>
    </Container>
  );
};

export default LoginPage;
