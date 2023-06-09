import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WeatherProvider from './contexts/weatherContext';
import WeatherPage from './pages/weatherPage';
import MovieTrackingPage from './pages/movieTrackingPage';
import MovieHomePage from './pages/movieHomePage';
import HomePage from './pages/homePage';
import Header from './components/siteHeader';
import LoginPage from './pages/loginPage';
import './index.css';

const PrivateRoute = ({children, isAuthenticated}) => {
  return isAuthenticated === true ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: "/login",
        // state: { from: props.location },
      }}
    />
  );
};

const App = () => {
  const [authenticated, setAuthenticated] = useState(true);

  const handleLogin = (username, password) => {
    setAuthenticated(false);
  };

  const handleRegister = (username, password) => {
    console.log('registered '  + username);
  };

  return (
    <div className="background-image">
      <Router>
        <Header authenticated={authenticated} />
        <Routes>
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} handleRegister={handleRegister} />} />
          <Route path="/weather" element={<PrivateRoute isAuthenticated={authenticated}><WeatherPage /></PrivateRoute>} />
      <Route path="/home" element={<PrivateRoute isAuthenticated={authenticated}><HomePage /></PrivateRoute>} />
      <Route path="/movielist/:listId" element={<PrivateRoute isAuthenticated={authenticated}><MovieTrackingPage /></PrivateRoute>} />
      <Route path="/movielist" element={<PrivateRoute isAuthenticated={authenticated}><MovieHomePage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/home"/>} />

        </Routes>
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
