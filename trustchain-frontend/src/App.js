import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa los componentes de las páginas
import HomePage from './components/HomePage';
import AdminPage from './components/AdminPage';
import DonatePage from './components/DonatePage';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
      <header>
        <h1>TrustChain</h1>
        <p>Transparencia en donaciones a eventos de caridad</p>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;