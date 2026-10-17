import React, { useState, useEffect, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import WeatherProvider from './contexts/weatherContext';
import SiteDataProvider, { SiteDataContext } from './contexts/siteDataContext';
import FeatureFlagProvider from './contexts/featureFlagContext';
import { AlertProvider } from './contexts/alertContext';
import { auth } from './firebase-config';
import MovieTrackingPage from './pages/movieTrackingPage';
import MovieHomePage from './pages/movieHomePage';
import SiteFooter from './components/siteFooter';
import BookDetailsPage from './pages/bookDetailsPage';
import MovieDetailsPage from './pages/movieDetailsPage';
import TVDetailsPage from './pages/tvDetailsPage';
import HomePage from './pages/homePage';
import UserActionPage from './pages/userActionPage';
import Header from './components/siteHeader';
import AlertNotice from './components/alertNotice';
import LoginPage from './pages/loginPage';
import UserManagementPage from './pages/userManagementPage';
import PersonPage from './pages/personPage';
import NotFoundPage from './pages/notFoundPage';
import { darkTheme, lightTheme } from './themes';
import { addUser, getUserById, updateUser } from './api/userDataStorage';
import { getMovieListsByUserId, updateMovieList } from './api/movieStorage';
import './index.css';

const FullPageSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

const PrivateRoute = ({ children, isAuthenticated, loadedUser }) => {
  if (isAuthenticated) return children;
  if (loadedUser) return <Navigate to="/usermgmt" replace />;
  return <FullPageSpinner />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loadedUser, setLoadedUser] = useState(false);
  const { darkMode } = useContext(SiteDataContext);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        setUser(null);
        setLoadedUser(true);
        return;
      }
      try {
        setUser(await getUserById(authUser.uid));
      } catch (error) {
        // A missing/unreadable profile shouldn't leave the app spinning forever
        console.error(error);
        setUser(null);
      } finally {
        setLoadedUser(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, username, password);
      const user = res.user;
      const userData = await getUserById(user.uid);
      //Ensure db matches auth email
      if(userData && userData.email !== user.email){
        userData.email = user.email;
        await updateUser(user.uid, userData);
        const movieLists = await getMovieListsByUserId(user.uid);
        for (const movieList of movieLists) {
            for (const userObj of movieList.users) {
                if (userObj.uid === user.uid) {
                    userObj.email = user.email;
                }
            }
            await updateMovieList(movieList.id, movieList);
        }
      }
      return res;
    } catch (error) {
      console.log(error);
      throw new Error('Incorrect username or password');
    }
  };

  const handleRegister = async (username, password, firstName, lastName, dateOfBirth) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, username, password);
      const userObject = {
        email: username,
        dateOfBirth: dateOfBirth,
        firstName: firstName,
        lastName: lastName,
        id: user.user.uid,
        adultAllowed: false,
        admin: false,
        active: true
      };
      await addUser(userObject);
    } catch (error) {
      console.log(error);
      throw new Error('Error signing up: ' + error.code);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      
      throw new Error('Error signing out: '+ error.code);
    }
  };

  const isActive = user != null && user.active;
  const guard = (element, allowed = isActive) => (
    <PrivateRoute isAuthenticated={allowed} loadedUser={loadedUser}>{element}</PrivateRoute>
  );
  const isStandalonePage = location.pathname === '/usermgmt/action';

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!isStandalonePage && <Header user={isActive ? user : null} />}
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route
              path="/usermgmt"
              element={<LoginPage handleLogin={handleLogin} handleRegister={handleRegister} handleLogout={handleLogout} isAuthenticated={user !== null} />}
            />
            <Route path="/home" element={guard(<HomePage />)} />
            <Route path="/movielist/:listId" element={guard(<MovieTrackingPage />)} />
            <Route path="/movie/:id" element={guard(<MovieDetailsPage />)} />
            <Route path="/book/:id" element={guard(<BookDetailsPage />)} />
            <Route path="/tvshow/:id" element={guard(<TVDetailsPage />)} />
            <Route path="/movielist" element={guard(<MovieHomePage />)} />
            <Route path="/person/:id" element={guard(<PersonPage />)} />
            <Route path="/usermgmt/action" element={<UserActionPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/admin" element={guard(<UserManagementPage />, isActive && user.admin)} />
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Box>
        {!isStandalonePage && <SiteFooter />}
      </Box>
      <AlertNotice />
    </ThemeProvider>
  );
};

const Root = () => (
  <Router>
    <WeatherProvider>
      <AlertProvider>
        <SiteDataProvider>
          <FeatureFlagProvider>
            <App />
          </FeatureFlagProvider>
        </SiteDataProvider>
      </AlertProvider>
    </WeatherProvider>
  </Router>
);

createRoot(document.getElementById('root')).render(<Root />);
