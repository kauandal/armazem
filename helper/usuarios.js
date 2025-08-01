const pool = require('../connection/connection').pool

async function read() {
    try {
        let conn = await pool.getConnection();
        const usuarios = await conn.query('SELECT id, nome, email, imagem FROM users ORDER BY nome ASC');
        if (conn) conn.release();
        return usuarios;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar usuarios' };
    }
}

async function create(nome, senha, email) {
    try {
        let conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO users (nome, senha, email) VALUES (?, ?, ?)',
            [nome, senha, email]
        );

        if (conn) conn.release();
        return { mensagem: `Usuario cadastrado com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar Usuario" };
    }
}

async function deletar(id) {
    try {
        let conn = await pool.getConnection();
        await conn.query('DELETE FROM users WHERE id = ?', [id]);
        if (conn) conn.release();
        return { mensagem: 'Usuario excluída com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro' };
    }
}


module.exports = { pool, read, create, deletar }