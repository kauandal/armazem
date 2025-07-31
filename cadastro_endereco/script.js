let idUpd = '';

const listarEnderecos = () => {
    fetch('http://localhost:8080/enderecos')
        .then(res => res.json())
        .then(enderecos => {
            const lista = document.getElementById('listaEnderecos');
            lista.innerHTML = '';
            enderecos.forEach(endereco => {
                const item = document.createElement('li');
                item.innerHTML = `
            ${endereco.rua}
            <div class="botoes-acao">
                <button class="btnView" onclick="verEndereco('${endereco.rua}', '${endereco.numero}', '${endereco.complemento}', '${endereco.cep}')">ver</button>
                <button class="btnUpdate" onclick="abrirUpdate(${endereco.id}, '${endereco.rua}', '${endereco.numero}', '${endereco.complemento}', '${endereco.cep}')">E</button>
                <button class="btnDelete" onclick="deleteEndereco(${endereco.id})">X</button>
            </div>
            `;

                lista.appendChild(item)
            });
        })
        .catch(err => {
            console.error("Erro ao buscar enderecos:", err);
        });
}

document.getElementById("btnAtualizar").addEventListener("click", listarEnderecos);

document.addEventListener('DOMContentLoaded', () => {
    listarEnderecos(); // carrega a primeira vez
    //setInterval(listarEnderecos, 3000); // atualiza a lista a cada 3 segundos
});

const verEndereco = (rua, numero, complemento, cep) => {
    document.getElementById("viewNomeRua").textContent = rua;
    document.getElementById("viewNumero").textContent = numero;
    document.getElementById("viewComplemento").textContent = complemento;
    document.getElementById("viewCep").textContent = cep;
    document.getElementById("modalView").style.display = "flex";
}

function fecharView() {
    document.getElementById("modalView").style.display = "none";
}



const enviarEndereco = (rua, numero, complemento, cep) => {
    fetch('http://localhost:8080/cadastrar-endereco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rua, numero, complemento, cep })  // transforma { nome: "..." } em JSON
    })
        .then(res => res.json())

        .then(data => {
            console.log("✅ Resposta do servidor:", data.mensagem);
            listarEnderecos();
        })
        .catch(err => {
            console.error("❌ Erro ao enviar:", err);
        });

};

const deleteEndereco = (id) => {
    if (!confirm("Deseja realmente excluir?")) return;
    fetch(`http://localhost:8080/endereco/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                listarEnderecos();
            } else {
                console.error("Erro ao exluir endereço");
            }
        })
        .catch(err => {
            console.error("erro na exclusão", err);
        });
};

const fecharEdicao = () => {
    document.getElementById("modalEdicao").style.display = "none";
    document.getElementById("ruaEdicao").value = "";
    document.getElementById("numeroEdicao").value = "";
    document.getElementById("complementoEdicao").value = "";
    document.getElementById("cepEdicao").value = "";
}

const abrirUpdate = (id, ruaAtual, numeroAtual, complementoAtual, cepAtual) => {
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const ruaModal = document.getElementById('ruaEdicao');
    const numeroModal = document.getElementById('numeroEdicao');
    const complementoModal = document.getElementById('complementoEdicao');
    const cepModal = document.getElementById('cepEdicao');

    ruaModal.value = ruaAtual;
    numeroModal.value = numeroAtual;
    complementoModal.value = complementoAtual;
    cepModal.value = cepAtual;

}

const salvarEndereco = () => {
    const ruaAtt = document.getElementById('ruaEdicao').value;
    const numeroAttt = document.getElementById('numeroEdicao').value;
    const complementoAtt = document.getElementById('complementoEdicao').value;
    const cepAtt = document.getElementById('cepEdicao').value;
    updateEndereco(idUpd, ruaAtt, numeroAttt, complementoAtt, cepAtt);
    fecharEdicao();
}

const updateEndereco = (id, novaRua, novoNumero, novoComplemento, novoCep) => {
    if (!novaRua || novaRua.trim() === "") {
        alert("Por favor, informe o nome da rua.");
        return;
    }

    if (!novoNumero) {
        alert("Por favor, informe o número.");
        return;
    }

    if (!novoComplemento || novoComplemento.trim() === "") {
        alert("Por favor, informe o complemento.");
        return;
    }

    if (!novoCep) {
        alert("Por favor, informe o cep.");
        return;
    }

    fetch(`http://localhost:8080/endereco/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            rua: novaRua,
            numero: novoNumero,
            complemento: novoComplemento,
            cep: novoCep
        })
    })
        .then(res => {
            if (res.ok) {
                listarEnderecos();
            } else {
                console.error("Erro ao atualizar endereço");
            }
        })
        .catch(err => {
            console.error("Erro na atualização", err);
        });
};

const abrirCadastro = () => {
    document.getElementById("modalCadastro").style.display = "flex";
};

const fecharModal = () => {
    document.getElementById("modalCadastro").style.display = "none";

    document.getElementById("nomeRua").value = "";
    document.getElementById("numero").value = "";
    document.getElementById("complemento").value = "";
    document.getElementById("cep").value = "";
};

const confirmarCadastro = () => {
    const rua = document.getElementById("nomeRua").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const cep = document.getElementById("cep").value;


    if (!rua || rua.trim() === "") {
        alert("Por favor, informe o nome da rua.");
        return;
    }

    if (!numero) {
        alert("Por favor, informe o número.");
        return;
    }

    if (!complemento || complemento.trim() === "") {
        alert("Por favor, informe o complemento.");
        return;
    }

    if (!cep || cep.toString()[5] === "-") {
        alert("Por favor, informe o cep. (sem o hífen)");
        return;
    }
    

    enviarEndereco(rua.trim(), numero, complemento.trim(), cep);
    fecharModal();
};

