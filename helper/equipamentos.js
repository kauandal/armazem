const pool = require('../connection/connection').pool;

async function read() {
    try {
        let conn = await pool.getConnection();
        const equipamentos = await conn.query('SELECT id, categoria, modelo, estado, quantidade, localizacao, marca FROM equipamentos ORDER BY categoria ASC');
        if (conn) conn.release();
        return equipamentos;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar equipamentos' };
    }
}

async function create(categoria, modelo, estado, quantidade, localizacao, marca) {
    try {
        let conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO equipamentos (categoria, modelo, estado, quantidade, localizacao, marca) VALUES (?, ?, ?, ?, ?, ?)',
            [categoria, modelo, estado, quantidade, localizacao, marca]
        );

        if (conn) conn.release();
        return { mensagem: `Equipamento cadastrado com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar equipamento" };
    }
}



module.exports = { pool, read, create }