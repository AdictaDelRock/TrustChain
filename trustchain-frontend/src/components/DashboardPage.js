import React, { useState, useEffect } from 'react';

function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [donations, setDonations] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar eventos con información de recaudación
      const eventsResponse = await fetch('http://localhost:5000/api/dashboard/events');
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEventDetails = async (eventId) => {
    try {
      // Cargar donaciones del evento
      const donationsResponse = await fetch(`http://localhost:5000/api/dashboard/events/${eventId}/donations`);
      if (donationsResponse.ok) {
        const donationsData = await donationsResponse.json();
        setDonations(donationsData.donations || []);
      }

      // Cargar transferencias del evento
      const transfersResponse = await fetch(`http://localhost:5000/api/dashboard/events/${eventId}/transfers`);
      if (transfersResponse.ok) {
        const transfersData = await transfersResponse.json();
        setTransfers(transfersData.transfers || []);
      }

      setSelectedEvent(eventId);

    } catch (error) {
      console.error('Error loading event details:', error);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando datos de transparencia...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Dashboard de Transparencia</h1>
      <p>Visualiza el flujo completo de las donaciones y transferencias</p>

      {/* Resumen General */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Eventos</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{events.length}</p>
        </div>
        <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Donaciones Totales</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ${events.reduce((sum, event) => sum + parseFloat(event.total_recaudado || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div style={{ marginBottom: '40px' }}>
        <h2>Eventos de Caridad</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          {events.map(event => (
            <div key={event.id} style={{ 
              border: '1px solid #ddd', 
              padding: '20px', 
              borderRadius: '8px',
              backgroundColor: selectedEvent === event.id ? '#f0f8ff' : 'white',
              cursor: 'pointer'
            }} onClick={() => loadEventDetails(event.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>{event.titulo}</h3>
                  <p style={{ margin: '0', color: '#666' }}>{event.descripcion}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196f3' }}>
                    ${parseFloat(event.total_recaudado || 0).toLocaleString()} {event.moneda}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Recaudado</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalles del Evento Seleccionado */}
      {selectedEvent && (
        <div>
          <h2>Detalles del Flujo de Fondos</h2>
          
          {/* Donaciones */}
          <div style={{ marginBottom: '30px' }}>
            <h3>Donaciones Recibidas</h3>
            {donations.length > 0 ? (
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Donador</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Monto</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(donation => (
                      <tr key={donation.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>Donador #{donation.id_usuario}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                          ${parseFloat(donation.monto).toLocaleString()} {donation.moneda}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: donation.estado === 'pagada' ? '#e8f5e9' : '#fff3e0',
                            color: donation.estado === 'pagada' ? '#2e7d32' : '#f57c00'
                          }}>
                            {donation.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(donation.creado_en).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No hay donaciones registradas para este evento
              </p>
            )}
          </div>

          {/* Transferencias */}
          <div>
            <h3>Transferencias a Organizaciones</h3>
            {transfers.length > 0 ? (
              <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f5f5f5' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Organización</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Monto</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Programada</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Liquidada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map(transfer => (
                      <tr key={transfer.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>Org. #{transfer.organizacion_id}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                          ${parseFloat(transfer.monto).toLocaleString()} {transfer.moneda}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            backgroundColor: transfer.estado === 'liquidada' ? '#e8f5e9' : 
                                           transfer.estado === 'en_proceso' ? '#e3f2fd' : '#ffebee',
                            color: transfer.estado === 'liquidada' ? '#2e7d32' : 
                                  transfer.estado === 'en_proceso' ? '#1565c0' : '#c62828'
                          }}>
                            {transfer.estado}
                          </span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(transfer.programada_en).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px' }}>
                          {transfer.liquidada_en ? new Date(transfer.liquidada_en).toLocaleDateString() : 'Pendiente'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No hay transferencias programadas para este evento
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;