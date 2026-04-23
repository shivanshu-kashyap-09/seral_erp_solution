import mysql from 'mysql2/promise';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

    console.log('Connected to MySQL. Running schema.sql...');
    const schema = fs.readFileSync('schema.sql', 'utf8');
    
    await connection.query(schema);
    console.log('Database initialized successfully.');
    await connection.end();
}

init().catch(console.error);
