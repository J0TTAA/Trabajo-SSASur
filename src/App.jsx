import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ContactView from './views/ContactView';
import ProtocoloView from './views/ProtocoloView';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/contactos" element={<ContactView />} />
        <Route path="/protocolos" element={<ProtocoloView />} />
        <Route path="/" element={<ProtocoloView />} /> {/* Página por defecto */}
      </Routes>
    </Router>
  );
};

export default App;
