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
    <button class="btnUpdate" onclick="abrirUpdate(${item.id}, '${item.categoria}', '${item.modelo}', '${item.estado}')">E</button>
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