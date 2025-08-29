const pool = require('../connection/connection').pool;

async function read() {
    try {
        let conn = await pool.getConnection();
        const usuarios = await conn.query('SELECT id, nome, email, imagem, localizacao FROM users ORDER BY nome ASC');
        if (conn) conn.release();
        return usuarios;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar usuarios' };
    }
}

async function create(nome, hash, email, imagem, permissao, localizacao) {
    try {
        let conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO users (nome, hash, email, imagem, permissao, localizacao) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, hash, email, imagem, permissao, localizacao]
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
        return { mensagem: 'Usuario excluído com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro' };
    }
}

async function put(id, nome, hash, email, localizacao) {
    try {
        let conn = await pool.getConnection();
        const result = await conn.query('UPDATE users SET nome = ?, hash = ?, email = ?, localizacao = ? WHERE id = ?', [nome, hash, email, localizacao, id]);

        if (result.affectedRows === 0) {
            return { erro: 'Usuario não encontrado.' };
        }
        if (conn) conn.release();
        return { mensagem: 'Usuario atualizado com sucesso.' };

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao atualizar Usuario.' };
    }

}

async function login(username, password) {
    const hashLogin = Buffer.from(`${username}:${password}`).toString('base64');

    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM users WHERE hash = ?', [hashLogin]);
        conn.release();

        const usuarioEncontrado = rows.length > 0;
        
        return {
            sucesso: usuarioEncontrado,
            permission: usuarioEncontrado ? rows[0].permissao : null,
            name: usuarioEncontrado ? rows[0].nome : null,
            image: usuarioEncontrado ? rows[0].imagem : null,
            localizacao: usuarioEncontrado ? rows[0].localizacao : null
        };

    } catch (err) {
        console.error('Erro no login:', err);
        return {
            sucesso: false,
            permissao: null
        };
    }
}



module.exports = { pool, put, read, create, deletar, login }