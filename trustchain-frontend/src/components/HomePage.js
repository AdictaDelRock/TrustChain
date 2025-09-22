import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const buttonStyle = {
    padding: '10px 20px',
    margin: '10px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  return (
    <div>
      <h2>Bienvenido</h2>
      <p>Selecciona una opción para continuar</p>
      <nav>
        <Link to="/admin">
          <button style={buttonStyle}>Agregar Eventos (Admin)</button>
        </Link>
        <Link to="/donate">
          <button style={buttonStyle}>Donar a un Evento</button>
        </Link>
        <Link to="/dashboard">
          <button style={buttonStyle}>Ver Transparencia</button>
        </Link>
      </nav>
    </div>
  );
}

export default HomePage;