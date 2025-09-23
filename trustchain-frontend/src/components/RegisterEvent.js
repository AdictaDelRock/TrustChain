import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterEvent() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    start_at: '',
    end_at: '',
    area_id: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el evento.');
      }

      const result = await response.json();
      console.log('Evento registrado:', result);
      alert('Evento registrado con éxito.');
      navigate('/'); // Redirige a la página principal
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Registrar Nuevo Evento</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Título:
          <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Descripción:
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange}></textarea>
        </label>
        <br />
        <label>
          Inicio:
          <input type="datetime-local" name="start_at" value={formData.start_at} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Fin:
          <input type="datetime-local" name="end_at" value={formData.end_at} onChange={handleChange} required />
        </label>
        <br />
        <label>
          ID de Área:
          <input type="number" name="area_id" value={formData.area_id} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Registrar Evento</button>
      </form>
    </div>
  );
}

export default RegisterEvent;