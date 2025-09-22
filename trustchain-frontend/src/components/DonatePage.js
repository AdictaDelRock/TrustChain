import React from 'react';

function DonatePage() {
  return (
    <div>
      <h2>Página de Donaciones</h2>
      <p>Aquí se mostrarán los eventos para que los usuarios puedan donar.</p>
      {/* Aquí iría la lógica para integrar con la API de Interledger */}
      <form>
        <label>
          Monto de la donación:
          <input type="number" name="donationAmount" />
        </label>
        <br />
        <button type="submit">Donar Ahora</button>
      </form>
    </div>
  );
}

export default DonatePage;