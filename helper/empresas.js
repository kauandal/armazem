const pool = require('../connection/connection').pool

async function read() {
    try {
        let conn = await pool.getConnection();
        const value = await conn.query('SELECT id, nome, cidade, estado, valor, rua, numero, complemento, cep FROM empresa');
        if (conn) conn.release();
        return (value);
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao listar empresas' };
    }

}
async function deletar(id) {
    try {
        let conn = await pool.getConnection();
        await conn.query('DELETE FROM empresa WHERE id = ?', [id]);
        if (conn) conn.release();
        return { mensagem: 'Empresa excluída com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro' };
    }

}

async function create(nome, cidade, estado, cnpj, rua, numero, complemento, cep) {
    try {
        let conn = await pool.getConnection();
        await conn.query("INSERT INTO empresa (nome, cidade, estado, valor, rua, numero, complemento, cep) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [nome, cidade, estado, cnpj, rua, numero, complemento, cep]);
        if (conn) conn.release();
        return { mensagem: `Empresa "${nome}" cadastrada com sucesso!` };

    } catch (err) {
        console.error(err);
        return { mensagem: "Erro ao cadastrar empresa" };
    }
}

async function put(id, nome, cidade, estado, cnpj, rua, numero, complemento, cep) {
    try {
        let conn = await pool.getConnection();
        const result = await conn.query('UPDATE empresa SET nome = ?, cidade = ?, estado = ?, valor = ?, rua = ?, numero = ?, complemento = ?, cep = ? WHERE id = ?', [nome, cidade, estado, cnpj, rua, numero, complemento, cep, id]);

        if (result.affectedRows === 0) {
            return { erro: 'Empresa não encontrada.' };
        }
        if (conn) conn.release();
        return { mensagem: 'Empresa atualizada com sucesso.' };

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao atualizar Empresa.' };
    }

}

module.exports = { put, read, deletar, pool, create }