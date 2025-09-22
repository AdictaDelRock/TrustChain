import React from 'react';

function AdminPage() {
  return (
    <div>
      <h2>Página de Administración</h2>
      <p>Aquí se creará el formulario para que los administradores agreguen nuevos eventos de caridad.</p>
      {/* Aquí iría la lógica para enviar datos a la base de datos */}
      <form>
        <label>
          Nombre del Evento:
          <input type="text" name="eventName" />
        </label>
        {/* Más campos aquí... */}
        <br />
        <button type="submit">Agregar Evento</button>
      </form>
    </div>
  );
}

export default AdminPage;