let idUpd = '';

const listarCNPJ = () => {
    fetch('http://localhost:8080/cnpj')
        .then(res => res.json())
        .then(cnpjs => {
            const lista = document.getElementById('listaCNPJ');
            lista.innerHTML = '';
            cnpjs.forEach(cnpj => {
                const item = document.createElement('li');
                item.innerHTML = `
            ${cnpj.valor}
            <div class="botoes-acao">
                <button class="btnUpdate" onclick="abrirUpdate(${cnpj.id}, '${cnpj.valor}')">E</button>
                <button class="btnDelete" onclick="deleteCNPJ(${cnpj.id})">X</button>
            </div>
            `;

                lista.appendChild(item)
            });
        })
        .catch(err => {
            console.error("Erro ao buscar cnpjs:", err);
        });
}

document.getElementById("btnAtualizar").addEventListener("click", listarCNPJ);

document.addEventListener('DOMContentLoaded', () => {
    listarCNPJ(); // carrega a primeira vez
    setInterval(listarCNPJ, 3000); // atualiza a lista a cada 3 segundos
});

const enviarCNPJ = (cnpj) => {
    fetch('http://localhost:8080/cadastrar-cnpj', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cnpj })  // transforma { nome: "..." } em JSON
    })
        .then(res => res.json())

        .then(data => {
            console.log("✅ Resposta do servidor:", data.mensagem);
            listarCNPJ();
        })
        .catch(err => {
            console.error("❌ Erro ao enviar:", err);
        });

};

const deleteCNPJ = (id) => {
    if (!confirm("Deseja realmente excluir?")) return;
    fetch(`http://localhost:8080/cnpj/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                listarCNPJ();
            } else {
                console.error("Erro ao exluir CNPJ");
            }
        })
        .catch(err => {
            console.error("erro na exclusão", err);
        });
};

const fecharEdicao = () => {
    document.getElementById("modalEdicao").style.display = "none";
}

const abrirUpdate = (id, cnpjAtual) => {
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const cnpjModal = document.getElementById('cnpjEdicao');

    cnpjModal.value = cnpjAtual;
}

const salvaCnpj = () => {
    const cnpjAtualizado = document.getElementById('cnpjEdicao').value;
    updateCNPJ(idUpd, cnpjAtualizado)
    fecharEdicao();
}


const updateCNPJ = (id, novoCNPJ) => {
    if (!novoCNPJ || novoCNPJ.trim() === "") {
        return;
    }

    fetch(`http://localhost:8080/cnpj/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cnpj: novoCNPJ })
    })
        .then(res => {
            if (res.ok) {
                listarCNPJ();
            } else {
                console.error("Erro ao atualizar CNPJ");
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
    document.getElementById("nomeCNPJ").value = "";
};

const confirmarCadastro = () => {
    const cnpj = document.getElementById("nomeCNPJ").value;


    if (!cnpj || cnpj.trim() === "") {
        alert("Por favor, informe o CNPJ.");
        return;
    }

    for(let i = 0;i < cnpj.toString().length;i++){
        if(cnpj.toString()[i] == "/" || cnpj.toString()[i] == "-" || cnpj.toString()[i] == "."){
            alert("Por favor, informe o CNPJ sem caracteres especiais.");
        return;
        }
    }

    enviarCNPJ(cnpj.trim());
    fecharModal();
    document.getElementById("nomeCNPJ").value = "";
};
