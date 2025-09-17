const express = require('express');
const cors = require('cors');
const cidades = require('./helper/cidades');
const cnpjs = require('./helper/cnpjs');
const enderecos = require('./helper/enderecos');
const empresas = require('./helper/empresas');
const usuarios = require('./helper/usuarios')
const equipamentos = require('./helper/equipamentos');
const computadores = require('./helper/computadores');

const ip = "localhost";
const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());


app.listen(port, ip, () => {
    console.log(`Servidor rodando em http://${ip}:${port}`);
});


//Cidades

app.post('/cadastrar-cidade', async (req, res) => {
    const { nome, estado } = req.body;
    if (cidades.create(nome, estado) === "Erro ao cadastrar cidade") {
        return res.status(400).json({ erro: 'Erro ao cadastrar cidade' });
    } else {
        return res.status(200).json({ mensagem: 'Cidade cadastrada com sucesso.' })
    }
});


app.get('/cidades', async (req, res) => {
    const listCidades = await cidades.read();
    res.json(listCidades);
});

app.delete('/cidades/:id', async (req, res) => {
    const id = req.params.id;
    if (cidades.deletar(id) === 'Erro ao excluir cidade') {
        return res.status(400).json({ erro: 'erro' });
    }
    else {
        return res.status(200).json({ mensagem: 'Cidade deletada com sucesso.' })
    }
});


app.put('/cidades/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome } = req.body;
    const { estado } = req.body;

    if (!nome || nome.trim() === "" || !estado || estado.trim() === "") {
        return res.status(400).json({ erro: 'Nome inválido.' });
    }

    cidades.put(nome, estado, id);
    return res.status(200).json({ mensagem: 'Cidade atualizada com sucesso.' });

});



//CNPJ

app.get('/cnpj', async (req, res) => {
    const listCnpjs = await cnpjs.read();
    res.json(listCnpjs);

});

app.post('/cadastrar-cnpj', async (req, res) => {
    const { cnpj } = req.body;
    if (cnpjs.create(cnpj) === "Erro ao cadastrar cnpj") {
        return res.status(400).json({ erro: 'Erro ao cadastrar cnpj' });
    } else {
        return res.status(200).json({ mensagem: 'CNPJ cadastrado com sucesso.' })
    }

});

app.delete('/cnpj/:id', async (req, res) => {
    const id = req.params.id;
    if (await cnpjs.deletar(id) === 'Erro') {
        return res.status(400).json({ mensagem: 'Erro ao excluir cnpj' })
    } else {
        return res.status(200).json({ mensagem: "CNPJ excluido com sucesso" })
    }
});

app.put('/cnpj/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { cnpj } = req.body;

    if (!cnpj || cnpj.trim() === "") {
        return res.status(400).json({ mensagem: 'Cnpj inválido' });
    }

    cnpjs.put(cnpj, id);
    return res.status(200).json({ mensagem: 'Cnpj atualizado com sucesso!' });
});

//Endereco


app.post('/cadastrar-endereco', async (req, res) => {
    const { rua, numero, complemento, cep } = req.body;
    if (enderecos.create(rua, numero, complemento, cep) === "Erro ao cadastrar endereco") {
        return res.status(400).json({ erro: 'Erro ao cadastrar endereco' });
    } else {
        return res.status(200).json({ mensagem: 'Endereco cadastrado com sucesso.' })
    }

})

app.get('/enderecos', async (req, res) => {
    const listEnderecos = await enderecos.read();
    res.json(listEnderecos);
});

app.delete('/endereco/:id', async (req, res) => {
    const id = req.params.id;
    if (enderecos.deletar(id) === 'Erro ao excluir endereco') {
        return res.status(400).json({ erro: 'erro' });
    }
    else {
        return res.status(200).json({ mensagem: 'Endereco deletado com sucesso.' })
    }
});


app.put('/endereco/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { rua, numero, complemento, cep } = req.body;

    if (!rua || rua.trim() === "" || !numero || !complemento || !cep || complemento.trim() === "") {
        return res.status(400).json({ erro: 'Nome inválido.' });
    }

    enderecos.put(id, rua, numero, complemento, cep);
    return res.status(200).json({ mensagem: 'Endereco atualizado com sucesso.' });
});


//Empresa

app.get('/empresas', async (req, res) => {
    const listEmpresas = await empresas.read();
    res.json(listEmpresas);
});

app.get('/nomesEmpresas', async (req, res) => {
    const listaEmpresas = await empresas.nomes();
    res.json(listaEmpresas);
});

app.delete('/empresa/:id', async (req, res) => {
    const id = req.params.id;
    if (empresas.deletar(id) === 'Erro') {
        return res.status(400).json({ erro: 'erro' });
    }
    else {
        return res.status(200).json({ mensagem: 'Empresa deletada com sucesso.' })
    }
});

app.post('/cadastrar-empresa', async (req, res) => {
    const { nome, cidade, estado, cnpj, rua, numero, complemento, cep } = req.body;
    if (empresas.create(nome, cidade, estado, cnpj, rua, numero, complemento, cep) === "Erro ao cadastrar empresa") {
        return res.status(400).json({ erro: 'Erro ao cadastrar empresa' });
    } else {
        return res.status(200).json({ mensagem: 'empresa cadastrada com sucesso.' })
    }
});

app.put('/empresa/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, cidade, estado, cnpj, rua, numero, complemento, cep } = req.body;

    if (!nome || nome.trim() === "" || !cidade || cidade.trim() === "" || !cnpj || cnpj.trim() === "") {
        return res.status(400).json({ erro: 'Nome inválido.' });
    }
    empresas.put(id, nome, cidade, estado, cnpj, rua, numero, complemento, cep);
    return res.status(200).json({ mensagem: 'Empresa atualizada com sucesso.' });
});



//Usuarios
app.get('/usuarios', async (req, res) => {
    const listUsuarios = await usuarios.read();
    res.json(listUsuarios);
});

app.post('/cadastrar-usuario', async (req, res) => {
    const { nome, hash, email, imagem, permissao, localizacao } = req.body;

    const resultado = await usuarios.create(nome, hash, email, imagem, permissao, localizacao);

    if (resultado.mensagem === "Erro ao cadastrar Usuario") {
        return res.status(400).json({ erro: 'Erro ao cadastrar usuário' });
    } else {
        return res.status(200).json({ mensagem: resultado.mensagem });
    }
});


app.delete('/usuario/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const resultado = await usuarios.deletar(id);

    if (resultado.mensagem === 'Erro') {
        return res.status(400).json({ erro: 'Erro ao deletar usuário' });
    } else {
        return res.status(200).json({ mensagem: resultado.mensagem });
    }
});


app.put('/usuario/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, hash, email, localizacao } = req.body;

    if (!nome || !hash || !email || !localizacao) {
        return res.status(400).json({ erro: 'Campos inválidos.' });
    }

    const resultado = await usuarios.put(id, nome, hash, email, localizacao);

    if (resultado.erro) {
        return res.status(404).json({ erro: resultado.erro });
    }

    return res.status(200).json({ mensagem: resultado.mensagem });
});

app.put('/permissoes/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id) {
        return res.status(400).json({ erro: 'ID inválido' });
    }

    const permissoes = req.body;

    try {
        await usuarios.editarPermissoes(id, permissoes);
        return res.status(200).json({ mensagem: 'Permissões atualizadas com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar permissões:', err);
        return res.status(500).json({ erro: 'Erro interno ao atualizar permissões' });
    }
});




app.get('/usuario/permissoes/:id', async(req,res) => {
    const id = parseInt(req.params.id);
    if(!id){
        return res.status(400).json({ mensagem: 'id inválido'})
    }
    
    const listPermissoes = await usuarios.permissoes(id);
    res.json(listPermissoes);
})



app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const resultado = await usuarios.login(username, password);


    if (resultado.sucesso) {
        return res.status(200).json({ success: resultado.sucesso, permission: resultado.permission, name: resultado.name, image: resultado.image, localizacao: resultado.localizacao });
    } else {
        return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }
});



app.post('/cadastrar-equipamento', async (req, res) => {
    const { categoria, modelo, estado, quantidade, localizacao, marca } = req.body;

    try {
        const resultado = await equipamentos.create(categoria, modelo, estado, quantidade, localizacao, marca);

        if (resultado.mensagem === "Erro ao cadastrar equipamento") {
            return res.status(400).json({ erro: resultado.mensagem });
        } else {
            return res.status(200).json({ mensagem: resultado.mensagem });
        }
    } catch (err) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

app.get('/equipamentos', async (req, res) => {
    const listEquipamentos = await equipamentos.read();
    res.json(listEquipamentos);
});

app.delete('/equipamento/:id', async (req, res) => {
    const id = req.params.id;
    if (equipamentos.deletar(id) === 'Erro ao excluir equipamento') {
        return res.status(400).json({ erro: 'Erro ao excluir equipamento' });
    }
    else {
        return res.status(200).json({ mensagem: 'Equipamento deletado com sucesso.' })
    }
});

app.put('/equipamento/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { categoria, modelo, estado, quantidade, localizacao, marca } = req.body;

    if (!categoria || categoria.trim() === "" || !modelo || modelo.trim() === "" || !estado || estado.trim() === "" || !quantidade || !localizacao || localizacao.trim() === "" || !marca || marca.trim() === "") {
        return res.status(400).json({ erro: 'campo inválido.' });
    }
    
    equipamentos.put(id, categoria, modelo, estado, quantidade, localizacao, marca);
    return res.status(200).json({ mensagem: 'Equipamento atualizado com sucesso.' });
});

app.post('/cadastrar-computador', async (req, res) => {
    const { categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao } = req.body;

    try {
        const resultado = await computadores.create(categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao);

        if (resultado.mensagem === "Erro ao cadastrar computador") {
            return res.status(400).json({ erro: resultado.mensagem });
        } else {
            return res.status(200).json({ mensagem: resultado.mensagem });
        }
    } catch (err) {
        console.error("Erro inesperado:", err);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

app.get('/computadores', async (req, res) => {
    const listarComputadores = await computadores.read();
    res.json(listarComputadores);
});

app.put('/computador/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao } = req.body;

    if (!categoria || categoria.trim() === "" || !especificacoes || especificacoes.trim() === "" || !memoria || memoria.trim() === "" || !quantidade || !localizacao || localizacao.trim() === "" || !processador || processador.trim() === "" || !armazenamento || armazenamento.trim() === "" || !fonte || fonte.trim() === ""  ) {
        return res.status(400).json({ erro: 'campo inválido.' });
    }
    
    computadores.put(id, categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao);
    return res.status(200).json({ mensagem: 'Computador atualizado com sucesso.' });
});

app.delete('/computador/:id', async (req, res) => {
    const id = req.params.id;
    if (computadores.deletar(id) === 'Erro ao excluir computador') {
        return res.status(400).json({ erro: 'Erro ao excluir computador' });
    }
    else {
        return res.status(200).json({ mensagem: 'Computador deletado com sucesso.' })
    }
});