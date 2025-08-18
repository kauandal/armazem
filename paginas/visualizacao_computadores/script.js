let idUpd = '';

const listarComputadores = () => {
    fetch('http://localhost:8080/computadores')
        .then(res => res.json())
        .then(computadores => {
            const tbody = document.querySelector("#listaComputadores tbody");
            tbody.innerHTML = ""; // Limpa o conteúdo anterior da tabela

            computadores.forEach(item => {
                const tr = document.createElement("tr");

                const categorias = ["categoria", "especificacoes", "quantidade", "memoria", "processador", "armazenamento", "fonte", "localizacao"];
                categorias.forEach(cat => {
                    const td = document.createElement("td");
                    td.textContent = item[cat]; // acessa dinamicamente a categoria
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);

                const acaoTd = document.createElement("td");
                acaoTd.innerHTML = `
<div class="botoes-acao">
    <button class="btnUpdate" onclick="abrirUpdate(${item.id}, '${item.categoria}', '${item.especificacoes}', '${item.quantidade}', '${item.memoria}', '${item.processador}', '${item.armazenamento}', '${item.fonte}', '${item.localizacao}')">
      <i class='bx bx-edit'></i>
    </button>
    <button class="btnDelete" onclick="deleteComputador(${item.id})">
      <i class='bx bx-trash-x'></i>
    </button>
  </div>
`;
                tr.appendChild(acaoTd);

            });
        })
};

document.getElementById("btnAtualizar").addEventListener("click", listarComputadores);

document.addEventListener('DOMContentLoaded', () => {
    listarComputadores();
    listarEmpresas();
});

const deleteComputador = (id) => {
    if (!confirm("Deseja realmente excluir?")) return;
    fetch(`http://localhost:8080/computador/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                listarComputadores();
            } else {
                console.error("Erro ao exluir computador");
            }
        })
        .catch(err => {
            console.error("erro na exclusão", err);
        });
};

const abrirUpdate = (id, categoriaAtual, especAtual, quantidadeAtual, memoriaAtual, processadorAtual, armazenamentoAtual, fonteAtual, localizacaoAtual) => {
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const categoriaModal = document.getElementById('categoriaEdicao');
    const especModal = document.getElementById('especEdicao');
    const quantidadeModal = document.getElementById('quantidadeEdicao')
    const memoriaModal = document.getElementById('memoriaEdicao');
    const processadorModal = document.getElementById('processadorEdicao');
    const armazenamentoModal = document.getElementById('armazenamentoEdicao');
    const fonteModal = document.getElementById('fonteEdicao');
    const localizacaoModal = document.getElementById('localizacaoEdicao');


    categoriaModal.value = categoriaAtual;
    especModal.value = especAtual;
    quantidadeModal.value = quantidadeAtual;
    memoriaModal.value = memoriaAtual;
    processadorModal.value = processadorAtual;
    armazenamentoModal.value = armazenamentoAtual;
    fonteModal.value = fonteAtual;
    localizacaoModal.value = localizacaoAtual;

}

const fecharEdicao = () => {
    document.getElementById("modalEdicao").style.display = "none";
    document.getElementById("categoriaEdicao").value = "";
    document.getElementById("especEdicao").value = "";
    document.getElementById("quantidadeEdicao").value = ""
    document.getElementById("memoriaEdicao").value = "";
    document.getElementById("processadorEdicao").value = "";
    document.getElementById("armazenamentoEdicao").value = "";
    document.getElementById("fonteEdicao").value = ""
    document.getElementById("localizacaoEdicao").value = ""
}

const salvaComputador = () => {
    const categoriaAtt = document.getElementById('categoriaEdicao').value;
    const especAttt = document.getElementById('especEdicao').value;
    const quantidadeAtt = document.getElementById('quantidadeEdicao').value;
    const memoriaAtt = document.getElementById('memoriaEdicao').value;
    const processadorAtt = document.getElementById('processadorEdicao').value;
    const armazenamentoAtt = document.getElementById('armazenamentoEdicao').value;
    const fonteAtt = document.getElementById('fonteEdicao').value;
    const localizacaoAtt = document.getElementById('localizacaoEdicao').value;
    updateComputador(idUpd, categoriaAtt, especAttt, quantidadeAtt, memoriaAtt , processadorAtt, armazenamentoAtt, fonteAtt, localizacaoAtt);
    fecharEdicao();
}

const updateComputador = async (id, novaCategoria, novaEspec, novaQuantidade, novaMemoria, novoProcessador, novoArmazenamento, novaFonte, novaLocalizacao) => {

    if (!novaCategoria || novaCategoria.trim() === "") {
        alert("Por favor, informe a categoria do computador.");
        return;
    }

    if (!novaEspec || novaEspec.trim() === "") {
        alert("Por favor, informe o estado.");
        return;
    }

    if (!novaQuantidade || novaQuantidade < 1) {
        alert("Por favor, informe a quantidade.");
        return;
    }

     if (!novaMemoria || novaMemoria.trim() === "") {
        alert("Por favor, informe a memoria do computador.");
        return;
    }

     if (!novoProcessador || novoProcessador.trim() === "") {
        alert("Por favor, informe o processador do computador.");
        return;
    }

     if (!novoArmazenamento || novoArmazenamento.trim() === "") {
        alert("Por favor, informe o armazenamento do computador.");
        return;
    }

     if (!novaFonte || novaFonte.trim() === "") {
        alert("Por favor, informe a fonte do computador.");
        return;
    }

    fetch(`http://localhost:8080/computador/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            categoria: novaCategoria,
            especificacoes: novaEspec,
            quantidade: novaQuantidade,
            memoria: novaMemoria,
            processador: novoProcessador,
            armazenamento: novoArmazenamento,
            fonte: novaFonte,
            localizacao: novaLocalizacao
            
        })
    })
        .then(res => {
            if (res.ok) {
                listarComputadores();
                console.log('Sucesso ao editar computador')
            } else {
                console.error("Erro ao atualizar computador");
            }
        })
        .catch(err => {
            console.error("Erro na atualização", err);
        });

};

const listarEmpresas = () => {
    fetch('http://localhost:8080/nomesEmpresas')
        .then(res => res.json())
        .then(empresas => {
            const datalist = document.getElementById('listaEmpresas');
            datalist.innerHTML = '';
            empresas.forEach(empresa => {
                const option = document.createElement('option');
                option.value = empresa.nome;
                option.dataset.id = empresa.id;

                datalist.appendChild(option)
            });
        })
        .catch(err => {
            console.error("Erro ao buscar empresas:", err);
        });
}

