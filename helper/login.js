const pool = require('../connection/connection').pool

async function read() {
    try {
        let conn = await pool.getConnection();
        const hashList = await conn.query('SELECT hash FROM users');
        if (conn) conn.release();
        console.log(hashList)
        return hashList;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar hashs' };
    }
}

module.exports = { pool, read }