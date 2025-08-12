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

    enderecos.put(rua, numero, complemento, cep, id);
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
    const { nome, hash, email, imagem, permissao } = req.body;
    if (usuarios.create(nome, hash, email, imagem, permissao) === "Erro ao cadastrar Usuario") {
        return res.status(400).json({ erro: 'Erro ao cadastrar usuario' });
    } else {
        return res.status(200).json({ mensagem: 'Usuario cadastrado com sucesso.' })
    }

})

app.delete('/usuario/:id', async (req, res) => {
    const id = req.params.id;
    if (usuarios.deletar(id) === 'Erro') {
        return res.status(400).json({ erro: 'Erro' });
    }
    else {
        return res.status(200).json({ mensagem: 'Usuario deletado com sucesso.' })
    }
});

app.put('/usuario/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, hash, email } = req.body;

    if (!nome || nome.trim() === "" || !hash || hash.trim() === "" || !email || email.trim() === "") {
        return res.status(400).json({ erro: 'campo inválido.' });
    }
    usuarios.put(id, nome, hash, email);
    return res.status(200).json({ mensagem: 'Usuario atualizado com sucesso.' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Dados incompletos.' });
    }

    const resultado = await usuarios.login(username, password); // <-- está chamando a função no usuarios.js
    

    if (resultado.sucesso) {
        return res.status(200).json({ success: true, permission: resultado.permission, name: resultado.name, image: resultado.image });
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

app.get('/equipamentos', async (req, res) => {
    const listEquipamentos = await equipamentos.read();
    res.json(listEquipamentos);
});