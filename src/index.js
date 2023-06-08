import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WeatherProvider  from './contexts/weatherContext';
import WeatherPage from './pages/weatherPage';
import MovieTrackingPage from './pages/movieTrackingPage';
import MovieHomePage from './pages/movieHomePage';
import HomePage from './pages/homePage';
import Header from './components/siteHeader';
import './index.css';


ReactDOM.render(
  <div className='background-image'>
  <Router>
  <Header />
    <WeatherProvider>
    <Routes>
      <Route path="/weather" element={<WeatherPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/movielist/:listId" element={<MovieTrackingPage />} />
      <Route path="/movielist" element={<MovieHomePage />} />
      <Route path="*" element={<Navigate to="/home"/>} />
    </Routes>
    </WeatherProvider>
  </Router>
  </div>,
  document.getElementById('root')
);
