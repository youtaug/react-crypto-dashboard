// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import HomePage from './pages/HomePage';
import CryptoDetailsPage from './pages/CryptoDetailsPage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/crypto/:id" element={<CryptoDetailsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
