const express = require('express');
const cors = require('cors');
const cidades = require('./helper/cidades');
const cnpjs = require('./helper/cnpj');
const enderecos = require('./helper/endereco');
const empresas = require('./helper/empresas');

const ip = "localhost";
const port = 8080;


const app = express();
app.use(express.json());
app.use(cors());

app.listen(port, ip, () => {
    console.log(`Servidor rodando em http://${ip}:${port}`);
});

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




app.get('/empresas', async (req, res) => {
    const listEmpresas = await empresas.read();
    res.json(listEmpresas);
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
