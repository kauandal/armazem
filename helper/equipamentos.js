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

async function deletar(id) {
    try {
        let conn = await pool.getConnection();
        await conn.query('DELETE FROM equipamentos WHERE id = ?', [id]);
        if (conn) conn.release();
        return { mensagem: 'Equipamento excluído com sucesso' };  // envia resposta OK
    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao excluir equipamento' };
    }
}

async function put(id, categoria, modelo, estado, quantidade, localizacao, marca) {
    try {
        let conn = await pool.getConnection();
        const result = await conn.query('UPDATE equipamentos SET categoria = ?, modelo = ?, estado = ?, quantidade = ?, localizacao = ?, marca = ? WHERE id = ?', [categoria, modelo, estado, quantidade, localizacao, marca, id]);
       
        return { mensagem: 'Equipamento atualizado com sucesso.' };

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao atualizar equipamento.' };
    }
}

module.exports = { pool, read, create, deletar, put }