const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: '192.168.1.76',
    user: 'root',
    password: 'Imp3r@tr1z',
    database: 'kauan',
});

module.exports = { pool }