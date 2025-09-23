const { Pool } = require('pg');

// Configura los detalles de tu base de datos
const pool = new Pool({
  user: 'postgres', // <--- Pon aquí tu usuario de PostgreSQL
  host: 'localhost', // <--- Pon aquí la dirección de tu servidor de base de datos
  database: 'db', // <--- Pon aquí el nombre de tu base de datos
  password: '1323', // <--- Pon aquí tu contraseña
  port: 5432, 
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};