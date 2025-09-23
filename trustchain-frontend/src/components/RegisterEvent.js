import React, { useState } from 'react';

function RegisterEvent() {
  const [form, setForm] = useState({
    horario: '',
    dias: '',
    nombre: '',
    institucion: '',
    llaves: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Datos ingresados:\nHorario: ${form.horario}\nDías: ${form.dias}\nNombre: ${form.nombre}\nInstitución: ${form.institucion}\nLlaves: ${form.llaves}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="horario" value={form.horario} onChange={handleChange} placeholder="Horario" required />
      <input name="dias" value={form.dias} onChange={handleChange} placeholder="Días" required />
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
      <input name="institucion" value={form.institucion} onChange={handleChange} placeholder="Institución" required />
      <input name="llaves" value={form.llaves} onChange={handleChange} placeholder="Llaves" required />
      <button type="submit">Enviar</button>
    </form>
  );
}

export default RegisterEvent;
