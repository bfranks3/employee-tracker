const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Scooby94!',
        database: 'employees'
    },
    console.log('Connected to employee database!')
);

module.exports = db;