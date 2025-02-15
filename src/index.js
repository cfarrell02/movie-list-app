import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WeatherProvider from './contexts/weatherContext';
import  SiteDataProvider  from './contexts/siteDataContext';
import { AlertProvider } from './contexts/alertContext';
import WeatherPage from './pages/weatherPage';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { addUser } from './api/userDataStorage';
import { auth } from './firebase-config';
import MovieTrackingPage from './pages/movieTrackingPage';
import MovieHomePage from './pages/movieHomePage';
import SiteFooter from './components/siteFooter';
import MovieDetailsPage from './pages/movieDetailsPage';
import TVDetailsPage from './pages/tvDetailsPage';
import HomePage from './pages/homePage';
import UserActionPage from './pages/userActionPage';
import Header from './components/siteHeader';
import AlertNotice from './components/alertNotice';
import LoginPage from './pages/loginPage';
import UserManagementPage from './pages/userManagementPage';
import './index.css';
import PersonPage from './pages/personPage';
import CircularProgress from '@mui/material/CircularProgress';
import { ThemeProvider } from '@emotion/react';
import { darkTheme,lightTheme } from './themes';
import NotFoundPage from './pages/notFoundPage';
import { getUserById, updateUser } from './api/userDataStorage';
import { getMovieListsByUserId, updateMovieList } from './api/movieStorage';


const PrivateRoute = ({ children, isAuthenticated, loadedUser }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Check if isAuthenticated is false and loadedUser is true
    if (!isAuthenticated && loadedUser) {
      setShouldRedirect(true);
    }
  }, [isAuthenticated, loadedUser]); // Include both dependencies in the array

  return isAuthenticated ? (
    children
  ) : (shouldRedirect ?(
    <Navigate to="/usermgmt" replace />
  )
  : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><CircularProgress/></div>
);
};



const App = () => {
  const [user, setUser] = useState(null);
  const [loadedUser, setLoadedUser] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      getUserById(user.uid).then((userData) => {
        setUser(userData);
        setLoadedUser(true);
      });
    });



    let theme = localStorage.getItem('isDarkMode') === 'true' ? 'dark' : 'light';
    if(theme){
      updateThemeProvider(theme === 'dark');
      setDarkMode(theme === 'dark');
      if(theme === 'dark'){
        document.body.style.backgroundColor = '#333333'
      }
      else{
        document.body.style.backgroundColor = '#f0f0f0'
      }
    }

    return () => {
      unsubscribe();
    }
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
        admin: false
      };
      await addUser(userObject);
    } catch (error) {
      console.log(error);
      throw new Error('Error signing up: ' + error.code);
    }
  };

  const updateThemeProvider = (isDarkMode) => {
    setDarkMode(isDarkMode);
  };
 

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      
      throw new Error('Error signing out: '+ error.code);
    }
  };

  return (
      <Router>
        <WeatherProvider>
        <AlertProvider>
        <SiteDataProvider>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        {window.location.pathname !== '/usermgmt/action' && <Header authenticated={user !== null} />}
        <Routes>
          <Route
            path="/usermgmt"
            element={<LoginPage handleLogin={handleLogin} handleRegister={handleRegister} handleLogout={handleLogout} isAuthenticated={user !==null} updateThemeProvider={updateThemeProvider} />}
          />
          {/* <Route
            path="/weather"
            element={<PrivateRoute isAuthenticated={user !== null} loadedUser={loadedUser}><WeatherPage /></PrivateRoute>}
          /> */}
          <Route
            path="/home"
            element={<PrivateRoute isAuthenticated={user !== null} loadedUser={loadedUser}><HomePage /></PrivateRoute>}
          />
          <Route
            path="/movielist/:listId"
            element={<PrivateRoute isAuthenticated={user !== null} loadedUser={loadedUser}><MovieTrackingPage /></PrivateRoute>}
          />
          <Route
            path="/movie/:id"
            element={<PrivateRoute isAuthenticated={user !== null} loadedUser={loadedUser}><MovieDetailsPage /></PrivateRoute>}
          />
          <Route
            path="/tvshow/:id"
            element={<PrivateRoute isAuthenticated={user !== null} loadedUser={loadedUser}><TVDetailsPage /></PrivateRoute>}
          />
          <Route
            path="/movielist"
            element={<PrivateRoute isAuthenticated={user !== null} loadedUser={loadedUser}><MovieHomePage /></PrivateRoute>}
          />
          <Route
            path="/person/:id"
            element={<PrivateRoute isAuthenticated={user !== null}><PersonPage /></PrivateRoute>}
          />
          <Route 
            path="/usermgmt/action"
            element={<UserActionPage />}
          />
          <Route
            path="/404"
            element={<NotFoundPage />}
          />
          <Route
            path="/admin"
            element={<PrivateRoute isAuthenticated={user !== null && user.admin} loadedUser={loadedUser}><UserManagementPage /></PrivateRoute>}
          />
          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        {/* <SiteFooter /> */}
        <AlertNotice/>
        </ThemeProvider>
        </SiteDataProvider>
        </AlertProvider>
        </WeatherProvider>
      </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
