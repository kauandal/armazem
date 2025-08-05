const pool = require('../connection/connection').pool

async function create(nome, estado) {
    try {
        let conn = await pool.getConnection();
        await conn.query('INSERT INTO cidades (nome, estado) VALUES (?, ?)', [nome, estado]);
        if (conn) conn.release();
        return { mensagem: `Cidade "${nome}" cadastrada com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar cidade" };
    }
}

async function read(params) {
    try {
        let conn = await pool.getConnection();
        const cidades = await conn.query('SELECT nome, id, estado FROM cidades ORDER BY nome ASC');
        if (conn) conn.release();
        return cidades;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar cidades' };
    }
}

async function deletar(id) {
    try {
        let conn = await pool.getConnection();
        await conn.query('DELETE FROM cidades WHERE id = ?', [id]);
        if (conn) conn.release();
        return { mensagem: 'Cidade excluída com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao excluir cidade' };
    }
}

async function put(nome, estado, id) {
    try {
        let conn = await pool.getConnection();
        const result = await conn.query('UPDATE cidades SET nome = ?, estado = ?  WHERE id = ?', [nome, estado, id]);

        if (result.affectedRows === 0) {
            return { erro: 'Cidade não encontrada.' };
        }
        if (conn) conn.release();
        return { mensagem: 'Cidade atualizada com sucesso.' };

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao atualizar cidade.' };
    }

}



module.exports = { create, pool, read, deletar, put }