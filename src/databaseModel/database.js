import 'dotenv/config';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

export default pool;
// const [rows] = await pool.query('SELECT * FROM users');
// console.log(rows);