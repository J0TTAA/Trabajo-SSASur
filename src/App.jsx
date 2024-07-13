import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CriteriosDerivacion from './pages/CriteriosDerivacion';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criterios-derivacion" element={<CriteriosDerivacion />} />
      </Routes>
    </Router>
  );
};

export default App;