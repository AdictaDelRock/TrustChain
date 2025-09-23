import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes basados en tu estructura de base de datos
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import DonatePage from './components/DonatePage';
import DashboardPage from './components/DashboardPage';
import RegisterEvent from './components/RegisterEvent';
import OrganizacionesPage from './components/OrganizacionesPage';
import EventosPage from './components/EventosPage';

// Context para manejar el estado global (fiel a tu DB)
import { UserProvider } from './context/UserContext';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <UserProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/donate/:eventoId?" element={<DonatePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/register-event" element={<RegisterEvent />} />
              <Route path="/organizaciones" element={<OrganizacionesPage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </UserProvider>
  );
}

export default App;