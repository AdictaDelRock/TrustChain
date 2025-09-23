import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1>TrustChain</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
        Transparencia total en donaciones a eventos de caridad mediante tecnología blockchain
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>👥 Para Donadores</h3>
          <p>Realiza donaciones transparentes y rastreables</p>
          <Link to="/donate">
            <button style={{ padding: '10px 20px', margin: '10px' }}>Donar Ahora</button>
          </Link>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>📊 Dashboard</h3>
          <p>Visualiza el flujo completo de las donaciones</p>
          <Link to="/dashboard">
            <button style={{ padding: '10px 20px', margin: '10px' }}>Ver Transparencia</button>
          </Link>
        </div>
        
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3>⚙️ Para Organizadores</h3>
          <p>Gestiona eventos y organizaciones benéficas</p>
          <Link to="/admin">
            <button style={{ padding: '10px 20px', margin: '10px' }}>Administrar</button>
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '50px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h2>¿Cómo funciona TrustChain?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '20px' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4>1. Creación de Eventos</h4>
            <p>Los organizadores crean eventos con distribución transparente de fondos</p>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4>2. Donaciones Seguras</h4>
            <p>Los donadores contribuyen con trazabilidad completa</p>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4>3. Distribución Automática</h4>
            <p>Los fondos se distribuyen automáticamente según los porcentajes establecidos</p>
          </div>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <h4>4. Transparencia Total</h4>
            <p>Cada transacción es registrada y verificable</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;