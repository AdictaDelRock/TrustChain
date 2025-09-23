import React, { useState, useEffect } from 'react';

function DonatePage() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log('Cargando eventos desde: http://localhost:5000/api/events');
        
        const response = await fetch('http://localhost:5000/api/events');
        
        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('El servidor devolvió HTML en lugar de JSON:', text.substring(0, 200));
          throw new Error(`Error: El endpoint no existe (${response.status} ${response.statusText})`);
        }

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || `Error ${response.status}`);
        }

        console.log('Eventos cargados:', result);
        setEvents(result.events || []);
        
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando donación:', { eventId: selectedEventId, amount: parseFloat(amount) });
      
      const response = await fetch('http://localhost:5000/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          eventId: selectedEventId, 
          amount: parseFloat(amount) 
        }), // Usa los nombres que espera tu backend
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        // Limpiar el formulario después de donar
        setSelectedEventId('');
        setAmount(0);
      } else {
        alert('Error: ' + (result.error || result.message));
      }
    } catch (error) {
      console.error('Error al procesar la donación:', error);
      alert('Error en la conexión con el servidor.');
    }
  };

  if (loading) return <div>Cargando eventos...</div>;
  if (error) return <div>Error al cargar eventos: {error}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Página de Donaciones</h2>
      <p>Selecciona un evento para donar.</p>
      
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Evento:
          </label>
          <select 
            value={selectedEventId} 
            onChange={(e) => setSelectedEventId(e.target.value)} 
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Selecciona un evento</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.titulo} - ${event.currentAmount || 0} / ${event.targetAmount || 10000}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Monto de la donación:
          </label>
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            min="1"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Ingresa tu Wallet Address:
          </label>
          <input 
            type="text" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
            min="1"
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Donar Ahora
        </button>
      </form>

      {/* Información de debug */}
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <h4>Información de Debug:</h4>
        <p><strong>Backend URL:</strong> http://localhost:5000</p>
        <p><strong>Total de eventos cargados:</strong> {events.length}</p>
        <p><strong>Evento seleccionado:</strong> {selectedEventId}</p>
        <p><strong>Monto:</strong> ${amount}</p>
      </div>
    </div>
  );
}

export default DonatePage;