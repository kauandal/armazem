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
            <button class="btnView" onclick="verUsuario('${usuario.nome}', '${usuario.email}')">ver</button>
            <button class="btnUpdate" onclick="abrirUpdate(${usuario.id}, '${usuario.nome}', '${usuario.hash}', '${usuario.email}', '${usuario.imagem}')">E</button>
            <button class="btnDelete" onclick="deleteUsuario(${usuario.id})">X</button>
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

const verUsuario = (nome, email) => {
    document.getElementById("viewNomeUsuario").textContent = nome;
    document.getElementById("viewEmail").textContent = email;
    document.getElementById("modalView").style.display = "flex";
}

function fecharView() {
    document.getElementById("modalView").style.display = "none";
}

const abrirCadastro = () => {
    document.getElementById("modalCadastro").style.display = "flex";
};

const fecharModal = () => {
    document.getElementById("modalCadastro").style.display = "none";

    document.getElementById("nomeExibicao").value = "";
    document.getElementById("nomeUsuario").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("email").value = "";

};

const confirmarCadastro = () => {
    const nome = document.getElementById("nomeExibicao").value;
    const login = document.getElementById("nomeUsuario").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;
    const imagem = '/imagens/user_padrao.jpeg'

    if (!nome || nome.trim() === "") {
        alert("Por favor, informe o nome da nome.");
        return;
    }

    if (!login || login.trim() === "" || !senha || senha.trim() === "") {
        alert("Por favor, informe o login e senha.");
        return;
    }

    if (!email || email.trim() === "") {
        alert("Por favor, informe o email.");
        return;
    }

    const permissaoSelecionada = document.querySelector('input[name="permissao"]:checked');
    if (!permissaoSelecionada) {
        alert("Por favor, selecione uma permissão.");
        return;
    }
    const permissao = permissaoSelecionada.value;


    const hash = login.trim() + ":" + senha.trim();
    const code_hash = btoa(hash);

    enviarUsuario(nome.trim(), code_hash, email.trim(), imagem, permissao);
    fecharModal();
};

const enviarUsuario = (nome, hash, email, imagem, permissao) => {
    fetch('http://localhost:8080/cadastrar-usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, hash, email, imagem, permissao })  // transforma { nome: "..." } em JSON
    })
        .then(res => res.json())

        .then(data => {
            console.log("✅ Resposta do servidor:", data.mensagem);
            listarUsuarios();
        })
        .catch(err => {
            console.error("❌ Erro ao enviar:", err);
        });

};

const deleteUsuario = (id) => {
    if (!confirm("Deseja realmente excluir?")) return;
    fetch(`http://localhost:8080/usuario/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                listarUsuarios();
            } else {
                console.error("Erro ao exluir usuário");
            }
        })
        .catch(err => {
            console.error("erro na exclusão", err);
        });

    listarUsuarios();
};

const abrirUpdate = (id, nomeAtual, senhaAtual, emailAtual, imagemAtual) => {
    document.getElementById("modalEdicao").style.display = "flex";

    idUpd = id;
    const nomeModal = document.getElementById('nomeEdicao');
    const emailModal = document.getElementById('emailEdicao');

    nomeModal.value = nomeAtual;
    emailModal.value = emailAtual;

}

const salvarUsuario = () => {
    const nomeAtt = document.getElementById('nomeEdicao').value;
    const loginAtt = document.getElementById('loginEdicao').value;
    const senhaAttt = document.getElementById('senhaEdicao').value;
    const emailAtt = document.getElementById('emailEdicao').value;

    updateUsuario(idUpd, nomeAtt, loginAtt, senhaAttt, emailAtt);
    fecharEdicao();
}

const updateUsuario = (id, novoNome, novoLogin, novaSenha, novoEmail) => {
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
            email: novoEmail
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
}
