const cadastrarEquipamento = () => {
    const categoria = (document.getElementById("categoria").value).toLowerCase()  ;
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
        alert("Por favor, informe o modelo.");
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
          if(data.mensagem === "Equipamento cadastrado com sucesso!"){
            mensagem = document.getElementById("message");
            mensagem.innerHTML = data.mensagem;
            }
        })
        .catch(err => {
            console.error("❌ Erro ao enviar:", err);
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

document.addEventListener('DOMContentLoaded', () => {
    listarEmpresas();
});


const cadastrarComputador = () => {
    const categoria = document.getElementById("categoriaPC").value;
    const especificacoes = document.getElementById("especPC").value;
    const quantidade = document.getElementById("qtdPC").value;
    const memoria = document.getElementById("memoriaPC").value;
    const processador = document.getElementById("processadorPC").value;
    const armazenamento = document.getElementById("armazenamentoPC").value;
    const fonte = document.getElementById("fontePC").value;
    const localizacao = document.getElementById("localPC").value;

    if (!categoria || categoria.trim() === "") {
        alert("Por favor, informe a categoria.");
        return;
    }
    if (!quantidade || quantidade < 1) {
        alert("Por favor, informe a memoria de computadores.");
        return;
    }
    if (!memoria || memoria.trim() === "") {
        alert("Por favor, informe a memoria.");
        return;
    }
     if (!processador || processador.trim() === "") {
        alert("Por favor, informe o processador.");
        return;
    }
     if (!armazenamento || armazenamento.trim() === "") {
        alert("Por favor, informe a quantidade de armazenamento.");
        return;
    }
         if (!fonte || fonte.trim() === "") {
        alert("Por favor, informe a fonte.");
        return;
    }
         if (!localizacao || localizacao.trim() === "") {
        alert("Por favor, informe a localizacao.");
        return;
    }

    fetch('http://localhost:8080/cadastrar-computador', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categoria, especificacoes, quantidade, memoria, processador, armazenamento, fonte, localizacao })  // transforma { nome: "..." } em JSON
    })
        .then(res => res.json())

        .then(data => {
          if(data.mensagem === "Computador cadastrado com sucesso!"){
            mensagem = document.getElementById("messageComputer");
            mensagem.innerHTML = data.mensagem;
            }
        })
        .catch(err => {
            console.error("❌ Erro ao enviar:", err);
        });
};
 