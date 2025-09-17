let idUpd = '';

const listarUsuarios = () => {
    fetch('http://localhost:8080/usuarios')
        .then(res => res.json())
        .then(usuarios => {
            const lista = document.getElementById('listaUsuarios');
            lista.innerHTML = '';
            usuarios.forEach(usuario => {
                const item = document.createElement('li');
                item.innerHTML = `
    <div class="usuario-item">
        <img src="${usuario.imagem}" alt="${usuario.nome}" class="avatar">
        <span class="nome-usuario">${usuario.nome}</span>
        <div class="botoes-acao">
            <button class="btnUpdate" onclick="abrirUpdate(${usuario.id}, '${usuario.nome}', '${usuario.email}', '${usuario.imagem}', '${usuario.localizacao}')">E</button>
        </div>
    </div>
`;

                lista.appendChild(item)
            });
        })
        .catch(err => {
            console.error("Erro ao buscar Usuarios:", err);
        });
}

document.getElementById("btnAtualizar").addEventListener("click", listarUsuarios);

document.addEventListener('DOMContentLoaded', () => {
    listarUsuarios(); // carrega a primeira vez
});


const abrirUpdate = (id, nomeAtual, emailAtual, imagemAtual, localizacaoAtual) => {
    idUpd = id;

    document.getElementById("modalEdicao").style.display = "flex";

   fetch(`http://localhost:8080/usuario/permissoes/${id}`)
    .then(res => res.json())
    .then(data => {
      const p = data[0]; // Assume que o resultado é um array com um único objeto

      document.getElementById('visualizacaoEquipamentos').checked = p.visualizacao_equipamentos === 1;
      document.getElementById('visualizacaoComputadores').checked = p.visualizacao_computadores === 1;
      document.getElementById('editarEquipamentos').checked = p.editar_equipamentos === 1;
      document.getElementById('cadastroEquipamentos').checked = p.cadastro_equipamentos === 1;
      document.getElementById('empresas').checked = p.empresas === 1;
      document.getElementById('usuarios').checked = p.usuarios === 1;
      document.getElementById('multi_filial').checked = p.multi_filial === 1;
    })
    .catch(err => {
      console.error('Erro ao carregar permissões:', err);
    });
};



const salvarPermissoes = () => {
  const permissoes = {
    visualizacao_equipamentos: document.getElementById('visualizacaoEquipamentos').checked ? 1 : 0,
    visualizacao_computadores: document.getElementById('visualizacaoComputadores').checked ? 1 : 0,
    editar_equipamentos: document.getElementById('editarEquipamentos').checked ? 1 : 0,
    cadastro_equipamentos: document.getElementById('cadastroEquipamentos').checked ? 1 : 0,
    empresas: document.getElementById('empresas').checked ? 1 : 0,
    usuarios: document.getElementById('usuarios').checked ? 1 : 0,
    multi_filial: document.getElementById('multi_filial').checked ? 1 : 0
  };

  fetch(`http://localhost:8080/permissoes/${idUpd}`, {
    method: 'PUT', // ou POST, dependendo da sua API
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(permissoes)
  })
    .then(res => {
      if (res.ok) {
        alert('Permissões atualizadas com sucesso!');
        fecharEdicao();
      } else {
        alert('Erro ao atualizar permissões');
        console.error(res.statusText);
      }
    })
    .catch(err => {
      console.error('Erro ao salvar permissões:', err);
    });
};


const fecharEdicao = () => {
  document.getElementById("modalEdicao").style.display = "none";
}