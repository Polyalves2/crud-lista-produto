let STORAGE_KEY = 'produtos_gerenciado';

function carregarProdutos() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
}

function salvarProdutos(produtos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

function formatarData(data) {
    if (!data) return '';
    const dataObj = new Date(data + 'T00:00:00');
    return dataObj.toLocaleDateString('pt-BR');
}


function configurarPaginaCadastro() {
    const formProduto = document.getElementById('formProduto');
    
    if (!formProduto) return;

    const produtoEditando = sessionStorage.getItem('produtoEditando');
    
    if (produtoEditando) {

        const produto = JSON.parse(produtoEditando);
        
        document.getElementById('nome').value = produto.nome;
        document.getElementById('preco').value = produto.preco;
        document.getElementById('categoria').value = produto.categoria;
        document.getElementById('origem').value = produto.origem;
        document.getElementById('lote').value = produto.lote;
        document.getElementById('validade').value = produto.validade;
        
        const botaoSubmit = formProduto.querySelector('button[type="submit"]');
        botaoSubmit.textContent = 'Atualizar Produto';
        botaoSubmit.className = 'w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500';
        
        document.title = 'Editar Produto';
        const titulo = document.querySelector('h1');
        if (titulo) {
            titulo.textContent = 'Editar Produto';
        }
        
        const botaoCancelar = document.createElement('button');
        botaoCancelar.type = 'button';
        botaoCancelar.textContent = 'Cancelar Edição';
        botaoCancelar.className = 'w-full mt-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
        botaoCancelar.onclick = function() {
            sessionStorage.removeItem('produtoEditando');
            window.location.href = 'lista.html';
        };
        
        formProduto.appendChild(botaoCancelar);
    }

    formProduto.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const produtos = carregarProdutos();
        const produtoEditando = sessionStorage.getItem('produtoEditando');

        if (produtoEditando) {

            const produto = JSON.parse(produtoEditando);
            const index = produtos.findIndex(p => p.id === produto.id);
            
            if (index !== -1) {
                produtos[index] = {
                    id: produto.id,
                    nome: document.getElementById('nome').value,
                    preco: parseFloat(document.getElementById('preco').value).toFixed(2),
                    categoria: document.getElementById('categoria').value,
                    origem: document.getElementById('origem').value,
                    lote: document.getElementById('lote').value,
                    validade: document.getElementById('validade').value
                };
                
                salvarProdutos(produtos);
                sessionStorage.removeItem('produtoEditando');
                
                alert("Produto atualizado com sucesso!");
                window.location.href = 'lista.html';
            }
        } else {

            const proximoId = produtos.length > 0 
                ? produtos.reduce((max, p) => (p.id > max ? p.id : max), 0) + 1
                : 1;

            const novoProduto = {
                id: proximoId,
                nome: document.getElementById('nome').value,
                preco: parseFloat(document.getElementById('preco').value).toFixed(2),
                categoria: document.getElementById('categoria').value,
                origem: document.getElementById('origem').value,
                lote: document.getElementById('lote').value,
                validade: document.getElementById('validade').value
            };
            
            produtos.push(novoProduto);
            salvarProdutos(produtos);
            
            alert("Seu Produto foi cadastrado com sucesso!");
            formProduto.reset();
        }
    });
}

function renderizarTabela() {
    const tabelaBody = document.getElementById('tabela-produtos');
    const listaVaziaMsg = document.getElementById('lista-vazia');

    if (!tabelaBody) return;

    const produtos = carregarProdutos();
    tabelaBody.innerHTML = ''; 

    if (produtos.length === 0) {
        listaVaziaMsg.classList.remove('hidden');
        return;
    } else {
        listaVaziaMsg.classList.add('hidden');
    }

    produtos.forEach(produto => {
        const linha = document.createElement('tr');
        linha.className = 'hover:bg-gray-50';
        linha.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">${produto.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${produto.nome}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ ${produto.preco}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${produto.categoria}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${produto.origem}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${produto.lote}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatarData(produto.validade)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="editarProduto(${produto.id})" class="text-blue-600 hover:text-blue-900">Editar</button>
                <button onclick="removerProduto(${produto.id})" class="text-red-600 hover:text-red-900">Remover</button>
            </td>
        `;
        tabelaBody.appendChild(linha);
    });
}

function removerProduto(id) {
    if (!confirm("Deseja excluir o produto?")) {
        return;
    }
    
    let produtos = carregarProdutos();
    produtos = produtos.filter(p => p.id !== id);
    salvarProdutos(produtos);
    renderizarTabela();
    
    alert("O produto foi removido com sucesso!");
}

function editarProduto(id) {
    const produtos = carregarProdutos();
    const produto = produtos.find(p => p.id === id);
    
    if (!produto) {
        alert("Produto não encontrado!");
        return;
    }
    
    sessionStorage.setItem('produtoEditando', JSON.stringify(produto));
    
    window.location.href = 'cadastro.html';
}

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('formProduto')) {
        configurarPaginaCadastro();
    } else if (document.getElementById('tabela-produtos')) {
        renderizarTabela();
    }
});