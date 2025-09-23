import React, { useState, useEffect } from 'react';

function DonatePage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard');
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_evento: parseInt(selectedEventId), monto: parseFloat(amount), id_usuario: 1 }), // id_usuario de prueba
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error al procesar la donación:', error);
      alert('Error en la conexión con el servidor.');
    }
  };

  return (
    <div>
      <h2>Página de Donaciones</h2>
      <p>Selecciona un evento para donar.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Evento:
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} required>
            <option value="">Selecciona un evento</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>{event.titulo}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Monto de la donación:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Donar Ahora</button>
      </form>
    </div>
  );
}

export default DonatePage;