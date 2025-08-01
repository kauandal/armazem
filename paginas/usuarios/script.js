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
            <button class="btnUpdate" onclick="abrirUpdate(${usuario.id}, '${usuario.nome}', '${usuario.senha}', '${usuario.email}', '${usuario.imagem}')">E</button>
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

    document.getElementById("nomeUsuario").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("email").value = "";
    document.getElementById("fotoPerfil").value = "";
};

const confirmarCadastro = () => {
    const nome = document.getElementById("nomeUsuario").value;
    const senha = document.getElementById("senha").value;
    const email = document.getElementById("email").value;


    if (!nome || nome.trim() === "") {
        alert("Por favor, informe o nome da nome.");
        return;
    }

    if (!senha || senha.trim()==="") {
        alert("Por favor, informe a senha.");
        return;
    }

    if (!email || email.trim() === "") {
        alert("Por favor, informe o email.");
        return;
    }


    enviarUsuario(nome.trim(), senha.trim(), email.trim());
    fecharModal();
};

const enviarUsuario = (nome, senha, email) => {
    fetch('http://localhost:8080/cadastrar-usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, senha, email })  // transforma { nome: "..." } em JSON
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
};