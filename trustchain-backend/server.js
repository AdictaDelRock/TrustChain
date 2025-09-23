const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000; // Puedes usar cualquier puerto libre, 5000 es común

// ----------------------
// MIDDLEWARE
// ----------------------
// Permite que el servidor acepte datos en formato JSON en las solicitudes
app.use(express.json());
// Permite la comunicación entre tu frontend de React y este backend
app.use(cors());

// ----------------------
// ENDPOINTS DE LA API
// ----------------------

// Endpoint para agregar un nuevo evento de caridad
app.post('/api/events', (req, res) => {
  const eventData = req.body;
  console.log('Datos del nuevo evento recibidos:', eventData);

  // --- AQUÍ IRÍA LA LÓGICA DE LA BASE DE DATOS ---
  // Por ahora, solo simulamos la respuesta.
  res.status(201).json({ 
    message: 'Evento agregado con éxito.', 
    event: eventData 
  });
});

// Endpoint para procesar una donación
app.post('/api/donate', (req, res) => {
  const donationData = req.body;
  console.log('Datos de la donación recibidos:', donationData);

  // --- AQUÍ IRÍA LA LÓGICA DE LA API DE INTERLEDGER Y LA BASE DE DATOS ---
  // Por ahora, solo simulamos la respuesta.
  res.status(200).json({ 
    message: 'Donación procesada con éxito.',
    transactionId: 'simulado_12345',
    amount: donationData.amount
  });
});

// Endpoint para obtener los datos del panel de transparencia
app.get('/api/dashboard', (req, res) => {
  // --- AQUÍ IRÍA LA LÓGICA PARA LEER DATOS DE LA BASE DE DATOS ---
  // Por ahora, usamos datos de ejemplo.
  const dashboardData = {
    totalDonations: 25000,
    fundations: [
      { name: 'Fundación ESCOM', percentage: 70, amount: 17500 },
      { name: 'Fundación IPN', percentage: 30, amount: 7500 },
    ],
  };
  res.status(200).json(dashboardData);
});

// ----------------------
// INICIAR SERVIDOR
// ----------------------
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});