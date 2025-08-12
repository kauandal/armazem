const pool = require('../connection/connection').pool;


async function create(categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao) {
    try {
        let conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO computadores (categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao]
        );

        if (conn) conn.release();
        return { mensagem: `Computador cadastrado com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar computador" };
    }
}

async function read() {
    try {
        let conn = await pool.getConnection();
        const computadores = await conn.query('SELECT id, categoria, especificacoes, quantitade, memoria, processador, armazenamento, fonte, localizacao FROM computadores ORDER BY categoria ASC');
        if (conn) conn.release();
        return computadores;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar computadores' };
    }
}

module.exports = { pool, read, create }