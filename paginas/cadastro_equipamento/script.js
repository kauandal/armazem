const cadastrarEquipamento = () => {
    const categoria = document.getElementById("categoria").value;
    const modelo = document.getElementById("modelo").value;
    const estado = document.getElementById("estado").value;
    const quantidade = document.getElementById("qtd").value;
    const localizacao = document.getElementById("local").value;
    const marca = document.getElementById("marca").value;


    if (!categoria || categoria.trim() === "") {
        alert("Por favor, informe a categoria.");
        return;
    }
    if (!modelo || modelo.trim() === "") {
        alert("Por favor, informe o número.");
        return;
    }
    if (!estado || estado.trim() === "") {
        alert("Por favor, informe o estado.");
        return;
    }
    if (!quantidade || quantidade < 1) {
        alert("Por favor, informe a quantidade.");
        return;
    }
     if (!localizacao || localizacao.trim() === "") {
        alert("Por favor, informe a localizacao.");
        return;
    }
     if (!marca || marca.trim() === "") {
        alert("Por favor, informe a marca.");
        return;
    }

    fetch('http://localhost:8080/cadastrar-equipamento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoria, modelo, estado, quantidade, localizacao, marca })  // transforma { nome: "..." } em JSON
    })
        .then(res => res.json())

        .then(data => {
            console.log("✅ Resposta do servidor:", data.mensagem);
        })
        .catch(err => {
            console.error("❌ Erro ao enviar:", err);
        });
};
 
const listarEmpresas = () => {
    fetch('http://localhost:8080/empresas')
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

document.addEventListener('DOMContentLoaded', () => {
    listarEmpresas();
});