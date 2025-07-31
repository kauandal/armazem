let idUpd = '';

const listarCidades = () => {

    fetch('http://localhost:8080/cidades')
        .then(res => res.json())
        .then(cidades => {
            const datalist = document.getElementById('listaCidades');
            datalist.innerHTML = ''; // limpa a lista
            cidades.forEach(cidade => {
                const option = document.createElement('option');
                option.value = cidade.nome;
                option.dataset.id = cidade.id;

                datalist.appendChild(option);
            });
        })
        .catch(err => {
            console.error("Erro ao carregar cidades:", err);
        });
}

const listarCNPJ = () => {
    fetch('http://localhost:8080/cnpj')
        .then(res => res.json())
        .then(cnpjs => {
            const datalist = document.getElementById('listaCnpjs');
            datalist.innerHTML = '';
            cnpjs.forEach(cnpj => {
                const option = document.createElement('option');
                option.value = cnpj.valor;
                option.dataset.id = cnpj.id;

                datalist.appendChild(option)
            });
        })
        .catch(err => {
            console.error("Erro ao buscar cnpjs:", err);
        });
}

const listarEnderecos = () => {
    fetch('http://localhost:8080/enderecos')
        .then(res => res.json())
        .then(enderecos => {
            const datalist = document.getElementById('listaEnderecos');
            datalist.innerHTML = '';
            enderecos.forEach(endereco => {
                const option = document.createElement('option');
                option.value = endereco.rua;
                option.dataset.id = endereco.id;

                datalist.appendChild(option)
            });
        })
        .catch(err => {
            console.error("Erro ao buscar enderecos:", err);
        });
}

const listarEmpresas = () => {
    fetch('http://localhost:8080/empresas')
        .then(res => res.json())
        .then(empresas => {
            const lista = document.getElementById('listaEmpresa');
            lista.innerHTML = ''; // limpa a lista
            empresas.forEach(empresa => {
                const item = document.createElement('li');
                item.innerHTML = `
  ${empresa.nome}
  <div class="botoes-acao">
  <button class="btnView" onclick="verEmpresa('${empresa.cidade}', '${empresa.estado}', '${empresa.valor}', '${empresa.rua}', '${empresa.numero}', '${empresa.complemento}', '${empresa.cep}')">ver</button>  
  <button class="btnUpdate" onclick="abrirUpdate(${empresa.id}, '${empresa.nome}', '${empresa.cidade}', '${empresa.valor}', '${empresa.rua}')">E</button>  
    <button class="btnDelete" onclick="deleteEmpresa(${empresa.id})">X</button>
  </div>
 `;
                lista.appendChild(item);
            });
        })
        .catch(err => {
            console.error("Erro ao buscar empresas:", err);
        });
};



document.getElementById("btnAtualizar").addEventListener("click", () => {
    listarCidades();
    listarCNPJ();
    listarEmpresas();
    listarEnderecos();
});

document.addEventListener('DOMContentLoaded', () => {
    listarEmpresas(); // carrega a primeira vez
    listarCidades();
    listarCNPJ();
    listarEnderecos();
});

const abrirCadastro = () => {
    document.getElementById("modalCadastro").style.display = "flex";
};

const fecharModal = () => {
    document.getElementById("modalCadastro").style.display = "none";
    document.getElementById("cadastraCidade").value = "";
    document.getElementById("cadastraCnpj").value = "";
    document.getElementById("cadastraNome").value = "";
    document.getElementById("cadastraEndereco").value = "";
};

const confirmarCadastro = () => {

    const cidade = document.getElementById("cadastraCidade").value;
    const cnpj = document.getElementById("cadastraCnpj").value;
    const nome = document.getElementById("cadastraNome").value
    const endereco = document.getElementById("cadastraEndereco").value;

    enviarEmpresa(nome, cidade, cnpj, endereco);
    fecharModal();
};

const enviarEmpresa = async (nome, cidade, cnpj, rua) => {
    try {
        const { cidadeEncontrada, cnpjEncontrado, ruaEncontrada } = await validaInformacoes(cidade, cnpj, rua);

        if (!cidadeEncontrada) {
            console.error("Cidade não encontrada.");
            return;
        }

        if (!ruaEncontrada) {
            console.error("Endereco não encontrado.");
            return;
        }

        if (!cnpjEncontrado) {
            console.error("CNPJ não encontrado.");
            return;
        }

        const estado = cidadeEncontrada.estado;
        const numero = ruaEncontrada.numero;
        const complemento = ruaEncontrada.complemento;
        const cep = ruaEncontrada.cep;


        const resCadastro = await fetch('http://localhost:8080/cadastrar-empresa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, cidade, estado, cnpj, rua, numero, complemento, cep })
        });

        const data = await resCadastro.json();

        console.log("✅ Resposta do servidor:", data.mensagem);
        listarEmpresas();

    } catch (err) {
        console.error("❌ Erro ao enviar:", err);
    }
};

const verEmpresa = (cidade, estado, cnpj, rua, numero, complemento, cep) => {
    document.getElementById("viewCidade").textContent = cidade;
    document.getElementById("viewEstado").textContent = estado;
    document.getElementById("viewCnpj").textContent = cnpj;
    document.getElementById("viewRua").textContent = rua;
    document.getElementById("viewNumero").textContent = numero;
    document.getElementById("viewComplemento").textContent = complemento;
    document.getElementById("viewCep").textContent = cep;
    document.getElementById("modalView").style.display = "flex";
}

const fecharView = () => {
    document.getElementById("modalView").style.display = "none";
}

const deleteEmpresa = (id) => {
    if (!confirm("Deseja realmente excluir?")) return;
    fetch(`http://localhost:8080/empresa/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                listarEmpresas();
            } else {
                console.error("Erro ao exluir empresa");
            }
        })
        .catch(err => {
            console.error("erro na exclusão", err);
        });
};

const abrirUpdate = (id, nomeAtual, cidadeAtual, cnpjAtual, enderecoAtual) => {
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const nomeModal = document.getElementById('nomeEdicao');
    const cidadeModal = document.getElementById('cidadeEdicao');
    const cnpjModal = document.getElementById('cnpjEdicao');
    const enderecoModal = document.getElementById('enderecoEdicao')

    nomeModal.value = nomeAtual;
    cidadeModal.value = cidadeAtual;
    cnpjModal.value = cnpjAtual;
    enderecoModal.value = enderecoAtual;

}

const fecharEdicao = () => {
    document.getElementById("modalEdicao").style.display = "none";
    document.getElementById("nomeEdicao").value = "";
    document.getElementById("cidadeEdicao").value = "";
    document.getElementById("cnpjEdicao").value = "";
    document.getElementById("enderecoEdicao").value = ""
}

const salvaEmpresa = () => {
    const nomeAtt = document.getElementById('nomeEdicao').value;
    const cidadeAttt = document.getElementById('cidadeEdicao').value;
    const cnpjAtt = document.getElementById('cnpjEdicao').value;
    const enderecoAtt = document.getElementById('enderecoEdicao').value;
    updateEmpresa(idUpd, nomeAtt, cidadeAttt, cnpjAtt, enderecoAtt);
    fecharEdicao();
}

const updateEmpresa = async (id, novoNome, novaCidade, novoCnpj, novoEndereco) => {
    const { cidadeEncontrada, cnpjEncontrado, ruaEncontrada } = await validaInformacoes(novaCidade, novoCnpj, novoEndereco);

  /*  if (!cidadeEncontrada) {
        console.error("Cidade não encontrada.");
        return;
    }

    if (!ruaEncontrada) {
        console.error("Endereco não encontrado.");
        return;
    }

    if(!cnpjEncontrado){
        console.error("CNPJ não encontrado");
        return;
    } */

    const estado = cidadeEncontrada.estado;
    const numero = ruaEncontrada.numero;
    const complemento = ruaEncontrada.complemento;
    const cep = ruaEncontrada.cep;



    if (!novoNome || novoNome.trim() === "") {
        alert("Por favor, informe o nome da empresa.");
        return;
    }

    if (!novoCnpj || novoCnpj.trim() === "") {
        alert("Por favor, informe o cnpj.");
        return;
    }

    fetch(`http://localhost:8080/empresa/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: novoNome,
            cidade: novaCidade,
            estado: estado,
            cnpj: novoCnpj,
            rua: novoEndereco,
            numero: numero,
            complemento: complemento,
            cep: cep
        })
    })
        .then(res => {
            if (res.ok) {
                listarEmpresas();
                console.log('Sucesso ao editar empresa')
            } else {
                console.error("Erro ao atualizar empresa");
            }
        })
        .catch(err => {
            console.error("Erro na atualização", err);
        });

};

const validaInformacoes = async (cidade, cnpj, rua) => {

    const resCidades = await fetch('http://localhost:8080/cidades');
    const cidades = await resCidades.json();

    const resRuas = await fetch('http://localhost:8080/enderecos');
    const ruas = await resRuas.json();

    const resCnpj = await fetch('http://localhost:8080/cnpj');
    const cnpjs = await resCnpj.json();

    const ruaEncontrada = ruas.find(aux => aux.rua === rua)
    const cidadeEncontrada = cidades.find(aux => aux.nome === cidade);
    const cnpjEncontrado = cnpjs.find(aux => aux.valor === cnpj)

    return {
        cidadeEncontrada: cidadeEncontrada,
        cnpjEncontrado: cnpjEncontrado,
        ruaEncontrada: ruaEncontrada
    };


}