import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inicio de sesión exitoso. ID de usuario: ' + data.userId);
        // En una app real, guardarías el ID de usuario en el estado global o en localStorage.
        // Por ahora, solo te redirigimos.
        navigate('/admin'); 
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error en la conexión con el servidor:', error);
      alert('Error de conexión. ¿El backend está corriendo?');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>
        <br />
        <label>
          Contraseña:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default LoginPage;