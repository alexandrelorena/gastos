// ---------------------------------------------- ↧ INDEX - INDEX.HTML ↧ ---------------------------------------------

 function toggleMode() {
    const body = document.body;
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    const mesButtons = document.getElementById('mesButtons').getElementsByTagName('a');

    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');

    const currentMode = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('preferredMode', currentMode);

    lightIcon.style.display = currentMode === 'light' ? 'inline-block' : 'none';
    darkIcon.style.display = currentMode === 'dark' ? 'inline-block' : 'none';

    for (let i = 0; i < mesButtons.length; i++) {
        mesButtons[i].classList.toggle('btn-light', currentMode === 'light');
        mesButtons[i].classList.toggle('btn-dark', currentMode === 'dark');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const preferredMode = localStorage.getItem('preferredMode');
    const body = document.body;
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');

    if (preferredMode === 'light') {
        body.classList.add('light-mode');
        lightIcon.style.display = 'inline-block';
        darkIcon.style.display = 'none';
    } else if (preferredMode === 'dark') {
        body.classList.add('dark-mode');
        lightIcon.style.display = 'none';
        darkIcon.style.display = 'inline-block';
    }
});

//const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
//const isFirefox = /Firefox/.test(navigator.userAgent);
//const isOpera = /OPR/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
//const isEdge = /Edg/.test(navigator.userAgent);
//const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
//
//if (isChrome) {
//    document.body.classList.add('browser-chrome');
//} else if (isFirefox) {
//    document.body.classList.add('browser-firefox');
//} else if (isOpera) {
//    document.body.classList.add('browser-opera');
//} else if (isEdge) {
//    document.body.classList.add('browser-edge');
//}

if (!window.userAgent) {
    const userAgent = navigator.userAgent.toLowerCase();
    window.userAgent = userAgent;
}

const body = document.body;

if (window.userAgent.includes('chrome') && window.userAgent.includes('google')) body.classList.add('browser-chrome');
else if (window.userAgent.includes('firefox')) body.classList.add('browser-firefox');
else if (window.userAgent.includes('opr') && window.userAgent.includes('google')) body.classList.add('browser-opera');
else if (window.userAgent.includes('edg')) body.classList.add('browser-edge');
else if (window.userAgent.includes('safari') && window.userAgent.includes('apple')) body.classList.add('browser-safari');


window.addEventListener('scroll', function () {
    // Verificar se os elementos existem antes de tentar acessá-los
    const tableBody = document.querySelector('.table tbody');
    const footer = document.querySelector('.footer');

    // Verificar se os elementos foram encontrados
    if (tableBody && footer) {
        // Verificar se há rolagem
        const hasScroll = tableBody.scrollHeight > tableBody.clientHeight;

        // Adicionar ou remover a classe dependendo se há rolagem
        footer.classList.toggle('footer-with-scroll', hasScroll);
    }
});

    // ---------------------------------------------- ↧ MENU - MENU.HTML ↧ ---------------------------------------------

    function carregarConteudoCompleto(pagina, mesAbreviado) {
        const mesDiv = document.getElementById('mesDiv');
        const header = document.getElementById('header');
        const xhrMes = new XMLHttpRequest();

        const mesesCompletos = {
            'jan': 'Janeiro',
            'fev': 'Fevereiro',
            'mar': 'Março',
            'abr': 'Abril',
            'mai': 'Maio',
            'jun': 'Junho',
            'jul': 'Julho',
            'ago': 'Agosto',
            'set': 'Setembro',
            'out': 'Outubro',
            'nov': 'Novembro',
            'dez': 'Dezembro'
        };

        // Limpa os botões existentes
        const mesButtons = document.getElementById('mesButtons');
        mesButtons.innerHTML = '';

        Object.keys(mesesCompletos).forEach(function (abreviacao) {
            const nomeCompleto = mesesCompletos[abreviacao];
            const li = document.createElement('li');
            li.classList.add('nav-item');
            li.appendChild(criarLinkMes(abreviacao, nomeCompleto)); // Passa abreviação para mostrar no link
            mesButtons.appendChild(li);
            console.log(mesAbreviado, abreviacao, nomeCompleto);
        });

//        xhrMes.onreadystatechange = function () {
//            if (xhrMes.readyState === 4 && xhrMes.status === 200) {
//                mesDiv.innerHTML = xhrMes.responseText;
//                // Atualiza o cabeçalho somente após carregar o conteúdo
//                console.log("Valor de mesAbreviado:", mesAbreviado);
//                const mesCompleto = mesesCompletos[mesAbreviado];
//                header.innerHTML = `Despesas do  mês de ${mesCompleto}`;
//            }
//        };

xhrMes.onreadystatechange = function () {
    if (xhrMes.readyState === 4 && xhrMes.status === 200) {
        mesDiv.innerHTML = xhrMes.responseText;
        // Atualiza o cabeçalho somente após carregar o conteúdo
        console.log("Valor de mesAbreviado:", mesAbreviado);
        if (mesesCompletos.hasOwnProperty(mesAbreviado)) {
            const mesCompleto = mesesCompletos[mesAbreviado];
            header.innerHTML = `Despesas do mês de ${mesCompleto}`;
        } else {
            console.error(`Mes abreviado "${mesAbreviado}" não é válido.`);
        }
    }
};


        xhrMes.open('GET', `${pagina}/${mesAbreviado}/`, true);
        xhrMes.send();
    }

    document.addEventListener('DOMContentLoaded', function () {
    const body = document.body;

    if (!body.classList.contains('loaded')) {
        const mesAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).toLowerCase().trim();
        const mesAbreviado = mesAtual.replace(".", ""); // Remover o ponto extra
        console.log("Mês atual:", mesAbreviado);

        carregarConteudoCompleto('mes', mesAbreviado);
        body.classList.add('loaded');
    }
});


    function criarLinkMes(abreviacao, nomeCompleto) {
        var link = document.createElement('a')
        link.classList.add('nav-link', 'custom-link', 'btn',  'btn-light', 'btn-sm', 'm-0.5');
        link.href = 'javascript:void(0)';
        link.onclick = function () {
            var mesLowerCase = abreviacao.toLowerCase();
            carregarConteudoCompleto('mes', mesLowerCase);
            // Adicione a classe ativa ao link visitado
            var linksMes = document.querySelectorAll('.nav-link');
            linksMes.forEach(function (link) {
                link.classList.remove('active-light', 'active-dark');
            });
            if (this.textContent.toLowerCase() === mesLowerCase) {
                if (document.body.classList.contains('dark-mode')) {
                    this.classList.add('active-dark');
                } else {
                    this.classList.add('active-light');
                }
            }
        };
        link.textContent = abreviacao.toUpperCase(); // Exibe a abreviação como texto do link
        link.dataset.nomeCompleto = nomeCompleto; // Armazena o nome completo do mês como atributo de dados
        return link;
    }

    // ---------------------------------------------- ↧ DESPESAS - MES.HTML ↧ ---------------------------------------------

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Verifique se esta é a cookie que estamos procurando
    if (cookie.substring(0, name.length + 1) === (name + '=')) {
    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    break;
}
}
}
    return cookieValue;
}

    // ---------------------------------------------- ↧ CARREAR CONTEÚDO ↧ ---------------------------------------------

    // Função para carregar conteúdo (GET) e adicionar evento de envio do formulário (POST)
    function carregarConteudo(pagina, mes) {
    const conteudo = document.getElementById('conteudo');
    const header = document.getElementById('header');
    const url = mesCompleto ? `${pagina}/${mesCompleto}/` : pagina;

    // Carregar conteúdo usando XMLHttpRequest com método GET
    const xhrGet = new XMLHttpRequest();
    xhrGet.onreadystatechange = function () {
    if (xhrGet.readyState === 4 && xhrGet.status === 200) {
    conteudo.innerHTML = xhrGet.responseText;

    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const anoAtual = getDataAtual();
    header.innerHTML = `<h1> Despesas do mês de ${mesCapitalizado + ' - ' + anoAtual}</h1>`;
}
};
    xhrGet.open('GET', url, true);
    xhrGet.send();

    // Adicionar um evento de envio do formulário
    const form = document.getElementById('edita_despesa');
    form.addEventListener('submit', function (event) {
    event.preventDefault();
    enviarFormulario(form, url, mes);
});
}

    // --------------------------------------------- ↥ CARREAR CONTEÚDO ↥ ----------------------------------------------

    // --------------------------------------------- ↧ ATUALIZAR DESPESA ↧ ---------------------------------------------

    // Função para enviar o formulário (POST) e atualizar a página
    function enviarFormulario(form, url, mes) {
    console.log('enviarFormulario chamado');
    const conteudo = document.getElementById('conteudo');
    const header = document.getElementById('header');
    const formData = new FormData(form);

    // Enviar formulário usando XMLHttpRequest com método POST
    const xhrPost = new XMLHttpRequest();
    xhrPost.onreadystatechange = function () {
    if (xhrPost.readyState === 4) {
    if (xhrPost.status === 200) {
    conteudo.innerHTML = xhrPost.responseText;

    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const anoAtual = getDataAtual();
    header.innerHTML = `<h1> Despesas do mês de ${mesCapitalizado + ' - ' + anoAtual}</h1>`;
} else {
    console.error('Erro ao carregar conteúdo:', xhrPost.status, xhrPost.statusText);
}
}
};

    xhrPost.open('POST', url, true);
    xhrPost.send(formData);
}

    // --------------------------------------------- ↥ ATUALIZAR DESPESA ↥ ---------------------------------------------

    // ----------------------------------------------- ↧ PAGAR DESPESA ↧ -----------------------------------------------

    function pagar(despesaId) {
    // Verifiqa se despesaId é um valor inteiro
    if (!Number.isInteger(parseInt(despesaId))) {
    console.error('despesaId não é um valor inteiro válido.');
    return;
}

    // Resto da sua função pagar...Obter o token CSRF antes da chamada AJAX
    const csrftoken = getCookie('csrftoken');

    // Enviar uma requisição AJAX para o servidor
    $.ajax({
    headers: {
    'X-CSRFToken': csrftoken
},
    url: '/pagar/' + despesaId + '/',  // Construa o URL dinamicamente
    type: 'POST',
    data: {
    'despesa.id': despesaId,
},
    success: function(data) {
    if (data && data.success) {
    // Atualiza a interface do usuário para refletir o status pago
    $(`#pago_${despesaId}`).prop('checked', true);
    $(`#pago_${despesaId}`).parent().css('color', 'green');
} else {
    // Lidar com erros
    console.error('Erro ao marcar a despesa como paga:', data && data.error ? data.error : 'Erro desconhecido');
}

    // Força a recarga da página
    window.location.reload(true);
},
    error: function(jqXHR, textStatus, errorThrown) {
    console.error('Erro AJAX:', textStatus, errorThrown);
},
});
}

    // ----------------------------------------------- ↥ PAGAR DESPESA ↥ -----------------------------------------------

    // ------------------------------------------------- ↧ DATA ATUAL ↧ ------------------------------------------------

    function getDataAtual() {
    const dataAtual = new Date();
    const mes = dataAtual.getMonth() + 1;
    const ano = dataAtual.getFullYear();
    return `${mes}/${ano}`;
}

    // ------------------------------------------------ ↥ DATA ATUAL ↥ -------------------------------------------------

    // ------------------------------------------ ↧ EXCLUIR DESPESA - MODAL ↧ ------------------------------------------

    function abrirModalExcluir(despesaId, nomeDespesa, despesaValor) {
    console.log('ID da Despesa:', despesaId);
    console.log('Nome da Despesa:', nomeDespesa);
    console.log('Valor da Despesa:', despesaValor.toFixed(2));

    // Formatar o valor da despesa para duas casas decimais
        let valorFormatado = parseFloat(despesaValor).toFixed(2);
        const valorNumerico = parseFloat(despesaValor);
        valorFormatado = valorNumerico.toFixed(2);

        // Configurar o ID da despesa, o nome e o valor no modal
    $('#modalDelete').find('.modal-body p').html(`<strong>${nomeDespesa}</strong>`);
    $('#modalDelete').find('.modal-footer .btn-danger').attr('onclick', `excluirDespesa(${despesaId})`);

    // Atualizar o nome da despesa no modal
    $('#nomeDespesaModal').text(nomeDespesa);

    // Exibir o modal de exclusão
    $('#modalDelete').modal('show');
}

    // Função para excluir a despesa
    function excluirDespesa(despesaId) {
    // Aqui você pode enviar uma solicitação AJAX para excluir a despesa do backend
    console.log('Excluir despesa com o ID:', despesaId);

    // Enviar uma solicitação AJAX para excluir a despesa
    $.ajax({
    url: '/deletar/' + despesaId + '/',  // Substitua pela URL correta do endpoint de exclusão de despesa
    type: 'POST',
    headers: {
    'X-CSRFToken': getCookie('csrftoken')  // Adicione o token CSRF aos cabeçalhos da solicitação
},
    success: function(response) {
    // Exibir mensagem de sucesso no modal
    $('#modalMessage').text('Despesa excluída com sucesso!');

    // Fechar o modal após um breve intervalo de tempo (opcional)
    setTimeout(function() {
    $('#modalDelete').modal('hide');
    // Recarregar a página após 5 segundos
    setTimeout(function() {
    window.location.reload(true);
}, 2000);
}, 2000);

},

    error: function(xhr, status, error) {
    // Exibir mensagem de erro no modal
    $('#modalMessage').text('Erro ao excluir a despesa: ' + error);

    // Exiba detalhes completos do erro no console
    console.log(xhr.responseText);
}
});
}

    // Função para cancelar a exclusão da despesa
    function cancelarExclusao() {
    // Fechar o modal de exclusão
    $('#modalDelete').modal('hide');
}

    // ------------------------------------------ ↥ EXCLUIR DESPESA - MODAL ↥ ------------------------------------------

    // --------------------------------------------- ↧ SELETOR DE STATUS ↧ ---------------------------------------------

    function applyStatusFilter(selectedStatus, pagina, mes) {
        let message = "";
        let textColor = "";

        const rows = document.querySelectorAll('.despesa-row');
        let hasDespesaOfType = false;

//        for (let i = 0; i < rows.length; i++) {
//            const row = rows[i];
//            const status = row.getAttribute('data-status');
//
//            if (selectedStatus === '' || selectedStatus === status) {
//                row.style.display = 'table-row'; // Exibe a linha se corresponder ao seletor
//                hasDespesaOfType = true; // Define como true se houver despesa correspondente
//            } else {
//                row.style.display = 'none'; // Oculta a linha se não corresponder ao seletor
//            }
//        }
let somaDespesas = 0; // Inicializa a soma das despesas

for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const status = row.getAttribute('data-status');
    const valorCelula = row.cells[2].textContent; // Supondo que a coluna dos valores seja a terceira
    const valorNumerico = parseFloat(valorCelula.replace(',', '.')); // Substitui vírgula por ponto e converte para número

    if (selectedStatus === '' || selectedStatus === status) {
        row.style.display = 'table-row';
        somaDespesas += valorNumerico; // Soma os valores corretamente tratados
    } else {
        row.style.display = 'none';
    }
}


// Aqui você pode atualizar a interface do usuário com a soma das despesas, por exemplo:
document.getElementById('totalSelect').textContent = somaDespesas.toFixed(2); // Formata para 2 casas decimais

// Verifica se o valor da soma das despesas é maior que zero
if (somaDespesas > 0) {
    document.getElementById('totalDespesasDiv').style.display = 'block'; // Exibe o bloco de código
} else {
    document.getElementById('totalDespesasDiv').style.display = 'none'; // Oculta o bloco de código
}

// Se não houver despesas do tipo selecionado, exibir a mensagem apropriada
if (somaDespesas === 0) {
    switch (selectedStatus) {
        case 'paga':
            message = 'Não há despesas pagas para exibir neste mês!';
            textColor = "brown";
            break;
        case 'atrasada':
            message = 'Não há despesas atrasadas para exibir neste mês!';
            textColor = "brown";
            break;
        case 'a_vencer':
            message = 'Não há despesas à vencer neste mês!';
            textColor = "brown";
            break;
        default:
            message = ''; // Caso padrão, mensagem vazia
    }
} else {
    // Se houver despesas, limpar a mensagem
    message = '';
}

// Atualizar o elemento HTML com a mensagem e cor definida
const mensagemElement = document.getElementById('mensagemDespesas');
mensagemElement.innerHTML = "<span style='color:" + textColor + "'>" + message + "</span>";


        // Se não houver despesa do tipo selecionado, exibir a mensagem
        if (!hasDespesaOfType) {
            mensagemElement.style.display = 'block';
            totalDespesasElement.style.display = 'none';
        } else {
            mensagemElement.style.display = 'none';
            totalDespesasElement.style.display = 'inline'; // ou 'block' dependendo do estilo que você deseja

        }
    }

    // --------------------------------------------- ↥ SELETOR DE STATUS ↥ ---------------------------------------------


