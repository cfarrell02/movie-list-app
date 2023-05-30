import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import Header from './components/siteHeader';
import './index.css';

ReactDOM.render(
  <div className='background-image'>
  <Header />
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </Router>
  </div>,
  document.getElementById('root')
);
