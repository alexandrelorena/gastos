function carregarConteudo(page) {
    console.log('Página clicada:', page);
    const urlParams = new URLSearchParams(window.location.search);
    const nome_mes = urlParams.get('nome_mes');

    if (nome_mes && page) {
        const url = `/mes/${nome_mes}/pagina/${page}`;
        console.log(url);

        carregarDespesasDoMesComPaginacao(nome_mes, page);
    }
}


function carregarDespesasDoMesComPaginacao(nome_mes, page) {
    // Fazer uma requisição AJAX para carregar as despesas do mês com paginação
    $.ajax({
        url: '/mes/' + nome_mes + '/pagina/' + page + '/',  // URL da sua view que retorna os dados paginados
        method: 'GET',
        data: {
            nome_mes: nome_mes,  // Alterado para 'nome_mes' para corresponder à forma como está sendo passado na URL
            page: page    // Alterado para 'page' para corresponder à forma como está sendo passado na URL
        },
        success: function(data) {
            // Manipular os dados retornados conforme necessário
            // Por exemplo, atualizar a tabela de despesas na página
            // Aqui você pode chamar uma função para manipular os dados retornados
            console.log('Dados recebidos:', data);
        },
        error: function(xhr, status, error) {
            // Lidar com erros de requisição, se houver
            console.error('Erro ao carregar despesas:', status, error);
        }
    });
}
