import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterEvent() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    start_at: '',
    end_at: '',
    area_id: '',
    payment_pointer:'',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Datos a enviar:', formData);
      
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta HTTP:', response.status, response.statusText);
      
      const result = await response.json();
      console.log('Respuesta completa:', result);

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('Evento registrado exitosamente:', result);
      alert('Evento registrado con éxito.');
      navigate('/');
      
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Registrar Nuevo Evento</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Título:
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>
            Descripción:
            <textarea 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px', height: '100px' }}
            ></textarea>
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>
            Fecha y hora de inicio:
            <input 
              type="datetime-local" 
              name="start_at" 
              value={formData.start_at} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>
            Fecha y hora de fin:
            <input 
              type="datetime-local" 
              name="end_at" 
              value={formData.end_at} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>
            Área:
            <select 
              name="area_id" 
              value={formData.area_id} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Selecciona un área</option>
              <option value="1">Derechos humanos</option>
              <option value="2">Protección del medio ambiente</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Ingresa el Wallet Address:
          </label>
          <input 
            type="text"  
            name="payment_pointer" 
            value={formData.payment_pointer} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Registrando...' : 'Registrar Evento'}
        </button>
      </form>
    </div>
  );
}

export default RegisterEvent;