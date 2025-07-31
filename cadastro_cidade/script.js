let idUpd = '';

const listarCidades = () => {
  fetch('http://localhost:8080/cidades')
    .then(res => res.json())
    .then(cidades => {
      const lista = document.getElementById('listaCidades');
      lista.innerHTML = ''; // limpa a lista
      cidades.forEach(cidade => {
        const item = document.createElement('li');
        item.innerHTML = `
  ${cidade.nome}
  -
  ${cidade.estado}
  <div class="botoes-acao">
    <button class="btnUpdate" onclick="abrirUpdate(${cidade.id}, '${cidade.nome}', '${cidade.estado}')">E</button>  
    <button class="btnDelete" onclick="deleteCidade(${cidade.id})">X</button>
  </div>
`;

        lista.appendChild(item);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar cidades:", err);
    });
}

document.getElementById("btnAtualizar").addEventListener("click", listarCidades);

document.addEventListener('DOMContentLoaded', () => {
  listarCidades(); // carrega a primeira vez
  // setInterval(listarCidades, 3000); // atualiza a lista a cada 3 segundos
});

const enviarNome = (nome, estado) => {
  fetch('http://localhost:8080/cadastrar-cidade', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nome, estado })  // transforma { nome: "..." } em JSON
  })
    .then(res => res.json())

    .then(data => {
      console.log("✅ Resposta do servidor:", data.mensagem);
      listarCidades();
    })
    .catch(err => {
      console.error("❌ Erro ao enviar:", err);
    });

};

const deleteCidade = (id) => {
  if (!confirm("Deseja realmente excluir esta cidade?")) return;

  fetch(`http://localhost:8080/cidades/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        listarCidades(); //para atualizar a lista
      } else {
        console.error("Erro ao exluir cidade");
      }
    })
    .catch(err => {
      console.error("erro na exclusão", err);
    });
};

const fecharEdicao = () => {
  document.getElementById("modalEdicao").style.display = "none";
}

const abrirUpdate = (id, nomeAtual, estadoAtual) => {
  document.getElementById("modalEdicao").style.display = "flex";

  idUpd = id;
  const nomeModal = document.getElementById('nomeEdicao');
  const estadoModal = document.getElementById('estadoEdicao');

  nomeModal.value = nomeAtual;
  estadoModal.value = estadoAtual;

}

const salvaCidade = () => {
  const nomeAtualizado = document.getElementById('nomeEdicao').value;
  const estadoAtualizado = document.getElementById('estadoEdicao').value;
  updateCidade(idUpd, nomeAtualizado, estadoAtualizado)
  fecharEdicao();
}

const updateCidade = (id, novoNome, estadoNovo) => {

  if (!novoNome || novoNome.trim() === "" || !estadoNovo || estadoNovo.trim() === "") return;

  fetch(`http://localhost:8080/cidades/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome: novoNome,
      estado: estadoNovo
    })
  })
    .then(res => {
      if (res.ok) {
        listarCidades();
      } else {
        console.error("Erro ao atualizar cidade");
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
  document.getElementById("nomeCidade").value = "";
  document.getElementById("estadoCidade").value = "";
};

const confirmarCadastro = () => {
  const nome = document.getElementById("nomeCidade").value;
  const estado = document.getElementById("estadoCidade").value;

  if (!nome || nome.trim() === "") {
    alert("Por favor, informe o nome da cidade.");
    return;
  }
  if (!estado || estado.trim() === "") {
    alert("Por favor, informe o nome do estado.");
    return;
  }

  enviarNome(nome.trim(), estado.trim());
  //Fecha o modal e limpa
  fecharModal();
  document.getElementById("nomeCidade").value = "";
  document.getElementById("estadoCidade").value = "";
};
