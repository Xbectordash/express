import mysql from 'mysql2/promise';
import 'dotenv/config';

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export async function initDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
        });

        // Check if DB exists
        const [databases] = await connection.query(`SHOW DATABASES LIKE ?`, [DB_NAME]);
        if (databases.length) {
            console.log(`✅ Database '${DB_NAME}' already exists.`);
        } else {
            await connection.query(`CREATE DATABASE \`${DB_NAME}\`;`);
            console.log(`✅ Database '${DB_NAME}' created.`);
        }

        // Connect to the DB now
        const db = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
        });

        // Check if table exists
        const [tables] = await db.query(`SHOW TABLES LIKE 'users'`);
        if (tables.length) {
            console.log(`✅ Table 'users' already exists.`);
        } else {
            await db.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          phone VARCHAR(100) NOT NULL UNIQUE,
          gender ENUM('Male', 'Female', 'Other') NOT NULL,
          address TEXT
        );
      `);
            console.log('✅ Table "users" created.');
        }

        // Insert default data if table is empty
        const [rows] = await db.query('SELECT COUNT(*) as count FROM users');
        if (rows[0].count === 0) {
            await db.query(`
        INSERT INTO users (name, email, phone, gender, address)
        VALUES 
        ('John Doe', 'john@example.com', '1234567890', 'Male', '123 Main St'),
        ('Jane Smith', 'jane@example.com', '9876543210', 'Female', '456 Oak Ave');
      `);
            console.log('✅ Default users inserted.');
        } else {
            console.log('ℹ️ Users table already has data.');
        }

        await connection.end();
        await db.end();
    } catch (err) {
        console.error('❌ DB Init Error:', err.message);
    }
}
