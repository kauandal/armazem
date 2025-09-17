document.addEventListener('DOMContentLoaded', () => {
    vePermissao(); // carrega a primeira vez
    carregarUsuario();
});

const loadPage = (page) => {
    document.getElementById("mainFrame").src = page;
}

const toggleSubmenu = (element) => {
    const submenu = element.nextElementSibling;
    const isActive = submenu.classList.contains("active");

    // Fecha todos os outros
    document.querySelectorAll(".submenu").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".menu-title").forEach(el => el.classList.remove("open"));

    // Abre o clicado, se estava fechado
    if (!isActive) {
        submenu.classList.add("active");
        element.classList.add("open");
    }
}

// Verifica se está autenticado
const auth = sessionStorage.getItem("auth");
if (!auth) {
    window.location.href = "login.html";
}

const logout = () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("permission");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("image");
    window.location.href = "login.html";
}

const vePermissao = () => {
    const permissaoString = sessionStorage.getItem('permission');
    if (!permissaoString) return; // sem permissão, sai da função

    const permissao = JSON.parse(permissaoString);

    if (parseInt(permissao.visualizacao_equipamentos) !== 1) {
        document.getElementById("visualizacao_equipamentos").style.display = "none";
    }

    if (parseInt(permissao.visualizacao_computadores) !== 1) {
        document.getElementById("visualizacao_computadores").style.display = "none";
    }

    if (parseInt(permissao.cadastro_equipamentos) !== 1) {
        document.getElementById("cadastro_equipamento").style.display = "none";
    }

    if (parseInt(permissao.empresas) !== 1) {
        document.getElementById("empresa").style.display = "none";
    }

    if (parseInt(permissao.usuarios) !== 1) {
        document.getElementById("usuarios").style.display = "none";
    }

    if (parseInt(permissao.multi_filial) !== 1) {
        //some o filtro de empresas dos equipamentos e computadores
    }
}


const carregarUsuario = () => {
    const name = sessionStorage.getItem("name");
    const image = sessionStorage.getItem("image");

    const userNameSpan = document.getElementById("nomeUsuario");
    const userPhotoImg = document.getElementById("imagemUsuario");

    if (name) userNameSpan.textContent = name;
    if (image) userPhotoImg.src = image;
};

const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}