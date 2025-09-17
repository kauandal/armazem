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
        const result = await conn.query(
            'INSERT INTO users (nome, hash, email, imagem, permissao, localizacao) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, hash, email, imagem, permissao, localizacao]
        );

        if (permissao == 0) {
            await conn.query(
                'INSERT INTO permissoes (id, permissao, visualizacao_equipamentos, visualizacao_computadores, editar_equipamentos, cadastro_equipamentos, empresas, usuarios, multi_filial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [result.insertId, 0, 1, 1, 1, 1, 1, 1, 1]
            );
        }
        else if (permissao == 1) {
            await conn.query(
                'INSERT INTO permissoes (id, permissao, visualizacao_equipamentos, visualizacao_computadores, editar_equipamentos, cadastro_equipamentos, empresas, usuarios, multi_filial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [result.insertId, 1, 1, 1, 1, 1, 1, 0, 0]
            );
        }
        else {
            await conn.query(
                'INSERT INTO permissoes (id, permissao, visualizacao_equipamentos, visualizacao_computadores, editar_equipamentos, cadastro_equipamentos, empresas, usuarios, multi_filial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [result.insertId, 2, 1, 1, 0, 0, 0, 0, 0]
            );
        }

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
        const rows = await conn.query(`
            SELECT 
                u.id,
                u.nome,
                u.email,
                u.imagem,
                u.localizacao,
                p.visualizacao_equipamentos,
                p.visualizacao_computadores,
                p.editar_equipamentos,
                p.cadastro_equipamentos,
                p.empresas,
                p.usuarios,
                p.multi_filial
            FROM 
                users u
            JOIN 
                permissoes p ON u.id = p.id
            WHERE 
                u.hash = ?
        `, [hashLogin]);

        conn.release();

        const usuarioEncontrado = rows.length > 0;

          if (!usuarioEncontrado) {
            return { sucesso: false, erro: 'Usuário não encontrado' };
        }

       const user = rows[0];
        const permission = {
            visualizacao_equipamentos: user.visualizacao_equipamentos,
            visualizacao_computadores: user.visualizacao_computadores,
            editar_equipamentos: user.editar_equipamentos,
            cadastro_equipamentos: user.cadastro_equipamentos,
            empresas: user.empresas,
            usuarios: user.usuarios,
            multi_filial: user.multi_filial
        };

        return {
            sucesso: true,
            permission,
            name: user.nome,
            image: user.imagem,
            localizacao: user.localizacao
        };


    } catch (err) {
        console.error('Erro no login:', err);
        return { sucesso: false, erro: 'Erro no servidor' };
    }
}

async function permissoes(id) {

    try {
        let conn = await pool.getConnection();
        const permissoes = await conn.query('SELECT permissao, visualizacao_equipamentos, visualizacao_computadores, editar_equipamentos, cadastro_equipamentos, empresas, usuarios, multi_filial FROM permissoes WHERE id = ?', [id]);
        if (conn) conn.release();
        return permissoes;

    } catch (err) {
        console.error(err);
        return { mensagem: 'Erro ao encontrar usuário' };
    }
}

async function editarPermissoes(id, permissoes) {
    const {
        visualizacao_equipamentos,
        visualizacao_computadores,
        editar_equipamentos,
        cadastro_equipamentos,
        empresas,
        usuarios,
        multi_filial
    } = permissoes;

    try {
        const conn = await pool.getConnection();

        await conn.query(`
            UPDATE permissoes
            SET visualizacao_equipamentos = ?,
                visualizacao_computadores = ?,
                editar_equipamentos = ?,
                cadastro_equipamentos = ?,
                empresas = ?,
                usuarios = ?,
                multi_filial = ?
            WHERE id = ?
        `, [
            visualizacao_equipamentos,
            visualizacao_computadores,
            editar_equipamentos,
            cadastro_equipamentos,
            empresas,
            usuarios,
            multi_filial,
            id
        ]);

        conn.release();
        return { mensagem: 'Permissões atualizadas com sucesso' };

    } catch (err) {
        console.error('Erro ao atualizar permissões:', err);
        throw err;
    }
}



module.exports = { pool, put, read, create, deletar, login, permissoes, editarPermissoes }