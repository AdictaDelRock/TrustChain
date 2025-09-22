import React from 'react';

function DashboardPage() {
  // Aquí se consumiría la información de la base de datos
  const mockData = {
    totalDonations: 15000,
    fundations: [
      { name: 'Fundación A', percentage: 40, amount: 6000 },
      { name: 'Fundación B', percentage: 60, amount: 9000 },
    ],
  };

  return (
    <div>
      <h2>Panel de Transparencia</h2>
      <p>Total de Donaciones: ${mockData.totalDonations}</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Distribución de Fondos</h3>
        {mockData.fundations.map((fundation, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
            <h4>{fundation.name}</h4>
            <p>Porcentaje: {fundation.percentage}%</p>
            <p>Monto: ${fundation.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;