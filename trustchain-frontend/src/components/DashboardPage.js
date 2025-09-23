import React, { useState, useEffect } from 'react';

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard');
        const data = await response.json();
        setDashboardData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
      }
    };
    fetchDashboardData();
  }, []);

  if (dashboardData.length === 0) {
    return <div>Cargando datos o no hay eventos registrados...</div>;
  }

  return (
    <div>
      <h2>Panel de Transparencia</h2>
      {dashboardData.map((event) => (
        <div key={event.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h4>{event.titulo}</h4>
          <p>Total Recaudado: ${event.total_recaudado || '0.00'}</p>
          <p>Descripción: {event.descripcion}</p>
        </div>
      ))}
    </div>
  );
}

export default DashboardPage;