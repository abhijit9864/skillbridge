
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Abhijit986@',
  // password: 'mkr5htgi',
  database: 'skillbridge',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise(); // Use promises for async/await

//http://localhost:4748