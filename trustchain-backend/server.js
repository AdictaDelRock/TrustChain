const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // Para generar IDs de transacción
const data = require('./data.json');

const app = express();
const PORT = 5000;

// Simula una base de datos en memoria para el hackathon
const donationsDB = [];
const eventsDB = [
  { id: 'event-1', name: 'Evento de Caridad ESCOM', targetAmount: 10000, currentAmount: 0 }
];

app.use(express.json());
app.use(cors());

// Endpoint para agregar un nuevo evento
app.post('/api/events', (req, res) => {
  const eventData = req.body;
  const newEvent = { 
    id: `event-${crypto.randomBytes(4).toString('hex')}`,
    name: eventData.name, 
    targetAmount: eventData.targetAmount,
    currentAmount: 0
  };
  eventsDB.push(newEvent);
  res.status(201).json({ message: 'Evento agregado con éxito.', event: newEvent });
});

// Endpoint para procesar una donación (simulando Interledger)
app.post('/api/donate', (req, res) => {
  const { eventId, amount } = req.body;
  const event = eventsDB.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({ message: 'Evento no encontrado.' });
  }

  // Lógica simulada de Interledger: registrar la donación de forma transparente
  const transactionId = crypto.randomBytes(16).toString('hex');
  const newDonation = {
    id: transactionId,
    eventId,
    amount,
    timestamp: new Date().toISOString(),
  };
  donationsDB.push(newDonation);
  event.currentAmount += amount;

  console.log(`Donación procesada. ID: ${transactionId}, Monto: ${amount}, Evento: ${event.name}`);

  res.status(200).json({ 
    message: 'Donación procesada con éxito a través de Interledger.',
    transactionId: newDonation.id,
    newAmount: event.currentAmount 
  });
});

// Endpoint para obtener datos del dashboard de transparencia
// En tu server.js, reemplaza el endpoint '/api/dashboard' con este
// Este endpoint obtendrá la lista de eventos directamente de tu base de datos
app.get('/api/dashboard', async (req, res) => {
  try {
    const eventsResult = await db.query(
      `SELECT
         e.id, e.titulo, e.descripcion, e.moneda,
         SUM(CASE WHEN d.estado = 'pagada' THEN d.monto ELSE 0 END) AS total_recaudado
       FROM evento AS e
       LEFT JOIN donacion AS d ON e.id = d.id_evento
       GROUP BY e.id
       ORDER BY e.id`
    );

    // Formatea los resultados para que sean más fáciles de usar en el frontend
    const events = eventsResult.rows.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      total_recaudado: parseFloat(row.total_recaudado || 0),
      moneda: row.moneda
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error('Error al obtener datos del dashboard:', error);
    res.status(500).json({ error: 'Error del servidor al cargar los eventos.' });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

// ... (código para importar express, cors, db, etc.)
// ... (asegúrate de tener tu conexión a la BD en db.js)

// Nuevo endpoint para el inicio de sesión
app.post('/api/login', async (req, res) => {
  const { nombre, password } = req.body;

  try {
    // 1. Encontrar el usuario por nombre
    const userResult = await db.query(
      `SELECT id, password_hash, tipo FROM usuario WHERE nombre = $1`,
      [nombre]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    const user = userResult.rows[0];

    // 2. En una app real, aquí se usaría bcrypt para comparar la contraseña
    // const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    // Para el hackathon, simulamos que la contraseña es "12345"
    if (password === "12345") {
      // Autenticación exitosa. Devuelve el ID del usuario y el tipo.
      res.status(200).json({ 
        message: 'Inicio de sesión exitoso.', 
        userId: user.id,
        userType: user.tipo 
      });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta.' });
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});