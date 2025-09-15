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
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const nomeModal = document.getElementById('nomeEdicao');
    const emailModal = document.getElementById('emailEdicao');
    const localizacaoModal = document.getElementById('localizacaoEdicao');

    nomeModal.value = nomeAtual;
    emailModal.value = emailAtual;
    localizacaoModal.value = localizacaoAtual;

}

const salvarUsuario = () => {
    const nomeAtt = document.getElementById('nomeEdicao').value;
    const loginAtt = document.getElementById('loginEdicao').value;
    const senhaAttt = document.getElementById('senhaEdicao').value;
    const emailAtt = document.getElementById('emailEdicao').value;
    const localizacaoAtt = document.getElementById('localizacaoEdicao').value;

    updateUsuario(idUpd, nomeAtt, loginAtt, senhaAttt, emailAtt, localizacaoAtt);
    fecharEdicao();
}

const updateUsuario = (id, novoNome, novoLogin, novaSenha, novoEmail, novaLocalizacao) => {
    if (!novoNome || novoNome.trim() === "") {
        alert("Por favor, informe o nome do Usuário.");
        return;
    }

    if (!novaSenha || !novoLogin || novoLogin.trim() === "" || novaSenha.trim() === "") {
        alert("Por favor, informe o novo login e Senha");
        return;
    }

    if (!novoEmail || novoEmail.trim() === "") {
        alert("Por favor, informe o email.");
        return;
    }


    if (!novaLocalizacao || novaLocalizacao.trim() === "") {
        alert("Por favor, informe a Filial.");
        return;
    }

    const hash = novoLogin.trim() + ":" + novaSenha.trim();
    const code_hash = btoa(hash);

    fetch(`http://localhost:8080/usuario/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: novoNome,
            hash: code_hash,
            email: novoEmail,
            localizacao: novaLocalizacao
        })
    })
        .then(res => {
            if (res.ok) {
                listarUsuarios();
            } else {
                console.error("Erro ao atualizar usuarios");
            }
        })
        .catch(err => {
            console.error("Erro na atualização", err);
        });
};

const fecharEdicao = () => {
    document.getElementById("modalEdicao").style.display = "none";
    document.getElementById("nomeEdicao").value = "";
    document.getElementById("senhaEdicao").value = "";
    document.getElementById("emailEdicao").value = "";
    document.getElementById("localizacaoEdicao").value = "";
}