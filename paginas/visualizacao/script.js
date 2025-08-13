let idUpd = '';

const listarEquipamentos = () => {
    fetch('http://localhost:8080/equipamentos')
        .then(res => res.json())
        .then(equipamentos => {
            const tbody = document.querySelector("#listaEquipamentos tbody");
            tbody.innerHTML = ""; // Limpa o conteúdo anterior da tabela

            equipamentos.forEach(item => {
                const tr = document.createElement("tr");

                const categorias = ["categoria", "modelo", "estado", "quantidade", "localizacao", "marca"];
                categorias.forEach(cat => {
                    const td = document.createElement("td");
                    td.textContent = item[cat]; // acessa dinamicamente a categoria
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);

                const acaoTd = document.createElement("td");
                acaoTd.innerHTML = `
  <div class="botoes-acao">
    <button class="btnUpdate" onclick="abrirUpdate(${item.id}, '${item.categoria}', '${item.modelo}', '${item.estado}', '${item.quantidade}', '${item.localizacao}', '${item.marca}')">E</button>
    <button class="btnDelete" onclick="deleteEquipamento(${item.id})">X</button>
  </div>
`;
                tr.appendChild(acaoTd);

            });

        })
};

document.getElementById("btnAtualizar").addEventListener("click", listarEquipamentos);

document.addEventListener('DOMContentLoaded', () => {
    listarEquipamentos();
    listarEmpresas();
});

const deleteEquipamento = (id) => {
    if (!confirm("Deseja realmente excluir?")) return;
    fetch(`http://localhost:8080/equipamento/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                listarEquipamentos();
            } else {
                console.error("Erro ao exluir equipamento");
            }
        })
        .catch(err => {
            console.error("erro na exclusão", err);
        });
};

const abrirUpdate = (id, categoriaAtual, modeloAtual, estadoAtual, quantidadeAtual, localizacaoAtual, marcaAtual) => {
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const categoriaModal = document.getElementById('categoriaEdicao');
    const modeloModal = document.getElementById('modeloEdicao');
    const estadoModal = document.getElementById('estadoEdicao');
    const quantidadeModal = document.getElementById('quantidadeEdicao')
    const localizacaoModal = document.getElementById('localizacaoEdicao');
    const marcaModal = document.getElementById('marcaEdicao');

    categoriaModal.value = categoriaAtual;
    modeloModal.value = modeloAtual;
    estadoModal.value = estadoAtual;
    quantidadeModal.value = quantidadeAtual;
    localizacaoModal.value = localizacaoAtual;
    marcaModal.value = marcaAtual;

}

const fecharEdicao = () => {
    document.getElementById("modalEdicao").style.display = "none";
    document.getElementById("categoriaEdicao").value = "";
    document.getElementById("modeloEdicao").value = "";
    document.getElementById("estadoEdicao").value = "";
    document.getElementById("quantidadeEdicao").value = ""
    document.getElementById("localizacaoEdicao").value = ""
    document.getElementById("marcaEdicao").value = ""
}

const salvaEquipamento = () => {
    const categoriaAtt = document.getElementById('categoriaEdicao').value;
    const modeloAttt = document.getElementById('modeloEdicao').value;
    const estadoAtt = document.getElementById('estadoEdicao').value;
    const quantidadeAtt = document.getElementById('quantidadeEdicao').value;
    const localizacaoAtt = document.getElementById('localizacaoEdicao').value;
    const marcaAtt = document.getElementById('marcaEdicao').value;
    updateEmpresa(idUpd, categoriaAtt, modeloAttt, estadoAtt, quantidadeAtt, localizacaoAtt, marcaAtt);
    fecharEdicao();
}

const updateEmpresa = async (id, novaCategoria, novoModelo, novoEstado, novaQuantidade, novaLocalizacao, novaMarca) => {

    if (!novaCategoria || novaCategoria.trim() === "") {
        alert("Por favor, informe a categoria do Equipamento.");
        return;
    }

    if (!novoEstado || novoEstado.trim() === "") {
        alert("Por favor, informe o estado.");
        return;
    }

    if (!novaQuantidade || novaQuantidade < 1) {
        alert("Por favor, informe a quantidade.");
        return;
    }

    fetch(`http://localhost:8080/empresa/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            categoria: novaCategoria,
            modelo: novoModelo,
            estado: novoEstado,
            quantidade: novaQuantidade,
            localizacao: novaLocalizacao,
            marca: novaMarca
        })
    })
        .then(res => {
            if (res.ok) {
                listarEquipamentos();
                console.log('Sucesso ao editar equipamento')
            } else {
                console.error("Erro ao atualizar equipamento");
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
