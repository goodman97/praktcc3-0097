//require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

/*const db = mysql.createConnection({ 
  host: 'localhost', 
  user: 'root',
  password: '', 
  database: 'notes_app' });*/

db.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
    return;
  }
  console.log('Berhasil terhubung ke database MySQL');
});

module.exports = db;