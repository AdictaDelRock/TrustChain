import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        // Guardar información del usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          id: data.userId,
          tipo: data.userType,
          nombre: nombre
        }));

        alert('Inicio de sesión exitoso');
        
        // Redirigir según el tipo de usuario
        if (data.userType === 'organizador') {
          navigate('/admin');
        } else {
          navigate('/donate');
        }
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Iniciar Sesión en TrustChain</h2>
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Usuario:
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <small style={{ color: '#666' }}>Usa "12345" como contraseña para testing</small>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Usuarios de Prueba:</h4>
        <p><strong>Organizador:</strong> usuario_organizador / 12345</p>
        <p><strong>Donador:</strong> usuario_donador / 12345</p>
      </div>
    </div>
  );
}

export default LoginPage;