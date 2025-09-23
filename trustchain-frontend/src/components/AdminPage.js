import React, { useState } from 'react';

function AdminPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [areaId, setAreaId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          titulo, 
          descripcion, 
          start_at: startAt, 
          end_at: endAt, 
          area_id: parseInt(areaId)
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setTitulo('');
        setDescripcion('');
        setStartAt('');
        setEndAt('');
        setAreaId('');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al agregar el evento:', error);
      alert('Error en la conexión con el servidor.');
    }
  };

  return (
    <div>
      <h2>Página de Administración</h2>
      <p>Crea un nuevo evento de caridad.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Título del Evento:
          <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </label>
        <br />
        <label>
          Descripción:
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
        </label>
        <br />
        <label>
          Fecha de Inicio:
          <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
        </label>
        <br />
        <label>
          Fecha de Fin:
          <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} required />
        </label>
        <br />
        <label>
          ID de Área:
          <input type="number" value={areaId} onChange={(e) => setAreaId(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Agregar Evento</button>
      </form>
    </div>
  );
}

export default AdminPage;