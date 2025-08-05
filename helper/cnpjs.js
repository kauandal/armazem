const pool = require('../connection/connection').pool

async function read() {
    try {
        let conn = await pool.getConnection();
        const value = await conn.query('SELECT valor, id FROM cnpj');
        if (conn) conn.release();
        return (value);
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar CNPJs' };
    }

}

async function create(cnpj) {
    try {
        let conn = await pool.getConnection();
        await conn.query('INSERT INTO cnpj (valor) VALUES (?)', [cnpj]);
        if (conn) conn.release();
        return { mensagem: `cnpj cadastrado com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar cnpj" };
    }
}

async function deletar(id) {
    try {
        let conn = await pool.getConnection();
        await conn.query('DELETE FROM cnpj WHERE id = ?', [id]);
        if (conn) conn.release();
        return { mensagem: 'CNPJ excluído com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro' };
    }
}

async function put(cnpj, id) {
    try {
        let conn = await pool.getConnection();
        const result = await conn.query('UPDATE cnpj SET valor = ? WHERE id = ?', [cnpj, id]);

        if (result.affectedRows === 0) {
            return { erro: 'Cnpj não encontrado.' };
        }
        if (conn) conn.release();
        return { mensagem: 'Cnpj atualizado com sucesso.' };

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao atualizar cnpj.' };
    }
}


module.exports = { read, pool, create, deletar, put }