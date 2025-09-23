const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'TrustChainBD',
  password: '856595J',
  port: 5432,
});

// Verificar conexión a la BD
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conexión a PostgreSQL establecida correctamente');
    release();
  }
});

// Simula una base de datos en memoria para el hackathon
const donationsDB = [];
const eventsDB = [
  { 
    id: 'event-1', 
    titulo: 'Evento de Caridad ESCOM', 
    targetAmount: 10000, 
    currentAmount: 0 
  }
];

app.use(express.json());
app.use(cors());

// Endpoint para agregar un nuevo evento
app.post('/api/events', (req, res) => {
  try {
    const { titulo, descripcion, start_at, end_at, area_id } = req.body;
    
    console.log('Datos recibidos para nuevo evento:', req.body);
    
    // Validaciones básicas
    if (!titulo || !start_at || !end_at) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: titulo, start_at, end_at' 
      });
    }

    // Crear nuevo evento con la estructura que espera tu frontend
    const newEvent = { 
      id: `event-${crypto.randomBytes(4).toString('hex')}`,
      titulo: titulo,
      descripcion: descripcion || '',
      start_at: start_at,
      end_at: end_at,
      area_id: area_id || null,
      targetAmount: 10000, // Valor por defecto para el hackathon
      currentAmount: 0
    };
    
    eventsDB.push(newEvent);
    
    console.log('Evento creado exitosamente:', newEvent);
    
    res.status(201).json({ 
      success: true,
      message: 'Evento registrado con éxito.', 
      event: newEvent 
    });
    
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor al crear el evento.' 
    });
  }
});

// Endpoint para obtener eventos (de la memoria)
app.get('/api/events', (req, res) => {
  res.status(200).json({
    success: true,
    events: eventsDB
  });
});

// Endpoint para procesar una donación
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

  console.log(`Donación procesada. ID: ${transactionId}, Monto: ${amount}, Evento: ${event.titulo}`);

  res.status(200).json({ 
    message: 'Donación procesada con éxito a través de Interledger.',
    transactionId: newDonation.id,
    newAmount: event.currentAmount 
  });
});

// Endpoint corregido para el dashboard (usa pool en lugar de db)
app.get('/api/dashboard', async (req, res) => {
  try {
    const eventsResult = await pool.query(
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

// Endpoint corregido para el inicio de sesión (usa pool en lugar de db)
app.post('/api/login', async (req, res) => {
  const { nombre, password } = req.body;

  try {
    // 1. Encontrar el usuario por nombre
    const userResult = await pool.query(
      `SELECT id, password_hash, tipo FROM usuario WHERE nombre = $1`,
      [nombre]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Usuario no encontrado.' });
    }

    const user = userResult.rows[0];

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

// Endpoint de prueba para verificar que el servidor funciona
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});

// Endpoint para dashboard - eventos con recaudación
app.get('/api/dashboard/events', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.id,
        e.titulo,
        e.descripcion,
        e.moneda,
        a.nombre as area_nombre,
        COUNT(d.id) as total_donaciones,
        COALESCE(SUM(CASE WHEN d.estado = 'pagada' THEN d.monto ELSE 0 END), 0) as total_recaudado
      FROM evento e
      LEFT JOIN area a ON e.area_id = a.id
      LEFT JOIN donacion d ON e.id = d.id_evento
      GROUP BY e.id, a.nombre
      ORDER BY e.id DESC
    `);

    res.json({ events: result.rows });
  } catch (error) {
    console.error('Error loading events for dashboard:', error);
    res.status(500).json({ error: 'Error loading events' });
  }
});

// Endpoint para donaciones de un evento específico
app.get('/api/dashboard/events/:eventId/donations', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(`
      SELECT d.*, u.nombre as donador_nombre
      FROM donacion d
      LEFT JOIN usuario u ON d.id_usuario = u.id
      WHERE d.id_evento = $1
      ORDER BY d.creado_en DESC
    `, [eventId]);

    res.json({ donations: result.rows });
  } catch (error) {
    console.error('Error loading donations:', error);
    res.status(500).json({ error: 'Error loading donations' });
  }
});

// Endpoint para transferencias de un evento específico
app.get('/api/dashboard/events/:eventId/transfers', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(`
      SELECT t.*, o.nombre as organizacion_nombre
      FROM transferencia t
      LEFT JOIN organizacion o ON t.organizacion_id = o.id
      WHERE t.evento_id = $1
      ORDER BY t.programada_en DESC
    `, [eventId]);

    res.json({ transfers: result.rows });
  } catch (error) {
    console.error('Error loading transfers:', error);
    res.status(500).json({ error: 'Error loading transfers' });
  }
});