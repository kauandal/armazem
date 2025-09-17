const pool = require('../connection/connection').pool

async function create(rua, numero, complemento, cep) {
    try {
        let conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO endereco (rua, numero, complemento, cep) VALUES (?, ?, ?, ?)',
            [rua, numero, complemento, cep]
        );

        if (conn) conn.release();
        return { mensagem: `Endereco cadastrado com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar endereco" };
    }
}

async function read() {
    try {
        let conn = await pool.getConnection();
        const enderecos = await conn.query('SELECT id, rua, numero, complemento, cep FROM endereco ORDER BY rua ASC');
        if (conn) conn.release();
        return enderecos;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar enderecos' };
    }
}

async function deletar(id) {
    try {
        let conn = await pool.getConnection();
        await conn.query('DELETE FROM endereco WHERE id = ?', [id]);
        if (conn) conn.release();
        return { mensagem: 'Endereco excluído com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao excluir endereco' };
    }
}

async function put(id, rua, numero, complemento, cep) {
    try {
        let conn = await pool.getConnection();
        const result = await conn.query('UPDATE endereco SET rua = ?, numero = ?, complemento = ?, cep = ? WHERE id = ?', [rua, numero, complemento, cep, id]);

        if (result.affectedRows === 0) {
            return { erro: 'Endereco não encontrado.' };
        }
        if (conn) conn.release();
        return { mensagem: 'Endereco atualizado com sucesso.' };

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao atualizar endereco.' };
    }

}


module.exports = { create, pool, put, read, deletar }