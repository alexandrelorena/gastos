
// Seleciona o elemento body do documento.
const body = document.body;

/* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ INDEX - INDEX.HTML ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */
//  Esta função alterna entre os modos claro e escuro da aplicação, atualizando a interface e armazenando a preferência do usuário localmente.
function toggleMode() {
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    const mesButtons = document.getElementById('mesButtons').querySelectorAll('a');

    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');

    const currentMode = body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('preferredMode', currentMode);

    lightIcon.style.display = currentMode === 'light' ? 'inline-block' : 'none';
    darkIcon.style.display = currentMode === 'dark' ? 'inline-block' : 'none';

    mesButtons.forEach(button => {
        button.classList.toggle('btn-light', currentMode === 'light');
        button.classList.toggle('btn-dark', currentMode === 'dark');
    });
}

//  Este evento executa uma função ao carregar a página, ajustando a interface de acordo com a preferência de modo armazenada localmente.
document.addEventListener('DOMContentLoaded', () => {
    const preferredMode = localStorage.getItem('preferredMode');

    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');

    if (preferredMode === 'light' || preferredMode === 'dark') {
        body.classList.add(`${preferredMode}-mode`);
        lightIcon.style.display = preferredMode === 'light' ? 'inline-block' : 'none';
        darkIcon.style.display = preferredMode === 'dark' ? 'inline-block' : 'none';
    }
});
    
// Define a variável userAgent apenas se ela não estiver definida.
if (!window.userAgent) {
    window.userAgent = navigator.userAgent.toLowerCase();
}

// Mapeia os navegadores para suas respectivas classes e adiciona a classe correspondente se o navegador for detectado.
const browserClasses = {
    'chrome': 'browser-chrome',
    'firefox': 'browser-firefox',
    'opr': 'browser-opera',
    'edg': 'browser-edge',
    'safari': 'browser-safari'
};

// Itera sobre as chaves do objeto browserClasses.
for (const browser in browserClasses) {
    // Verifica se o user agent contém a chave do navegador.
    if (window.userAgent.includes(browser)) {
        // Adiciona a classe correspondente ao elemento body.
        body.classList.add(browserClasses[browser]);
        // Interrompe o loop após encontrar o navegador correspondente.
        break;
    }
}

// Ajusta a classe do elemento .footer dependendo se há rolagem suficiente no elemento .table tbody.
function handleScroll() {
    const tableBody = document.querySelector('.table tbody');
    const footer = document.querySelector('.footer');

    if (tableBody && footer) {
        const hasScroll = tableBody.scrollHeight > tableBody.clientHeight;
        footer.classList.toggle('footer-with-scroll', hasScroll);
    }
}

window.addEventListener('scroll', handleScroll);

/* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ MENU - MENU.HTML ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

    // Carrega o conteúdo completo de um mês na página, atualizando a visualização e o cabeçalho.
    function carregarConteudoCompleto(pagina, mesAbreviado) {
        const mesDiv = document.getElementById('mesDiv');
        const header = document.getElementById('header');
    
        const mesesCompletos = {
            'jan': 'Janeiro', 'fev': 'Fevereiro', 'mar': 'Março', 'abr': 'Abril',
            'mai': 'Maio', 'jun': 'Junho', 'jul': 'Julho', 'ago': 'Agosto',
            'set': 'Setembro', 'out': 'Outubro', 'nov': 'Novembro', 'dez': 'Dezembro'
        };
    
        const mesButtons = document.getElementById('mesButtons');
        mesButtons.innerHTML = '';
    
        Object.entries(mesesCompletos).forEach(([abreviacao, nomeCompleto]) => {
            const li = document.createElement('li');
            li.classList.add('nav-item');
            li.appendChild(criarLinkMes(abreviacao, nomeCompleto));
            mesButtons.appendChild(li);
        });
    
        const xhrMes = new XMLHttpRequest();
        xhrMes.onreadystatechange = function () {
            if (xhrMes.readyState === 4 && xhrMes.status === 200) {
                mesDiv.innerHTML = xhrMes.responseText;
                if (mesesCompletos.hasOwnProperty(mesAbreviado)) {
                    const mesCompleto = mesesCompletos[mesAbreviado];
                    header.innerHTML = `Despesas do mês de ${mesCompleto}`;
                } else {
                    console.error(`Mês abreviado "${mesAbreviado}" não é válido.`);
                }
            }
        };
    
        xhrMes.open('GET', `${pagina}/${mesAbreviado}/`, true);
        xhrMes.send();
    }
    
    // Carrega automaticamente o conteúdo do mês atual quando a página é carregada, evitando carregamentos duplicados.
    document.addEventListener('DOMContentLoaded', function () {

        if (!body.classList.contains('loaded')) {
            const mesAtual = new Date().toLocaleString('pt-BR', { month: 'short' }).toLowerCase().trim().replace(".", "");
            carregarConteudoCompleto('mes', mesAtual);
            body.classList.add('loaded');
        }
    });
    
    // Cria e configura links de navegação para cada mês, permitindo a navegação entre eles.
    function criarLinkMes(abreviacao, nomeCompleto) {
        const link = document.createElement('a');
        link.classList.add('nav-link', 'custom-link', 'btn', 'btn-light', 'btn-sm', 'm-0.5', 'active-dark', 'active-light');
        link.href = 'javascript:void(0)';
        link.onclick = function () {
            const mesLowerCase = abreviacao.toLowerCase();
            carregarConteudoCompleto('mes', mesLowerCase);
            const linksMes = document.querySelectorAll('.nav-link');
            linksMes.forEach(link => link.classList.remove('active-light', 'active-dark'));
            if (this.textContent.toLowerCase() === mesLowerCase) {
                if (document.body.classList.contains('dark-mode')) {
                    this.classList.add('active-dark');
                } else {
                    this.classList.add('active-light');
                }
            }
        };
        link.textContent = abreviacao.toUpperCase();
        link.dataset.nomeCompleto = nomeCompleto;
        return link;
    }

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥  MENU - MENU.HTML ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */
    
    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ DESPESAS - MES.HTML ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

    //  Usado em cenários de autenticação de usuário, gerenciamento de sessão e personalização da experiência do usuário, 
        // permitindo recuperar valores de cookies relevantes para esses fins.
        function getCookie(name) {
            const cookieName = `${name}=`;
            const cookies = document.cookie.split(';');
        
            for (const cookie of cookies) {
                const trimmedCookie = cookie.trim();
                if (trimmedCookie.startsWith(cookieName)) {
                    return decodeURIComponent(trimmedCookie.substring(cookieName.length));
                }
            }
        
            return null;
        }       
       
     /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥ DESPESAS - MES.HTML ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */
    
        
    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ CARREAR CONTEÚDO ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

// Carrega dinamicamente o conteúdo de uma página, filtrando por mês, e atualiza o conteúdo e o cabeçalho da página.
function carregarConteudo(pagina, mes) {
    const conteudo = document.getElementById('conteudo');
    const header = document.getElementById('header');
    const mesCompleto = mes ? capitalizeFirstLetter(mes) : '';
    const url = mesCompleto ? `${pagina}/${mesCompleto}/` : pagina;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            conteudo.innerHTML = xhr.responseText;
            atualizarHeader(header, mesCompleto);
        }
    };
    xhr.open('GET', url, true);
    xhr.send();

    adicionarEventoFormulario('edita_despesa', url, mes);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function atualizarHeader(headerElement, mes) {
    const anoAtual = getDataAtual();
    headerElement.innerHTML = `<h1>Despesas do mês de ${mes} - ${anoAtual}</h1>`;
}

function adicionarEventoFormulario(formId, url, mes) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            enviarFormulario(form, url, mes);
        });
    }
}

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥ CARREAR CONTEÚDO ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ PAGAR DESPESA ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

    function pagar(despesaId) {
        // Confirma se o ID da despesa é um número inteiro antes de continuar
        if (!Number.isInteger(parseInt(despesaId))) {
            console.error('O ID fornecido não é um número inteiro válido.');
            return;
        }
    
        // Obtém o token CSRF para uso na requisição
        const csrftoken = getCookie('csrftoken');
    
        // Realiza uma chamada AJAX para registrar o pagamento da despesa
        $.ajax({
            headers: {
                'X-CSRFToken': csrftoken
            },
            url: `/pagar/${despesaId}/`,  // Utiliza o ID da despesa para construir o URL
            type: 'POST',
            data: {
                'despesa.id': despesaId,
            },
            success: function(data) {
                if (data && data.success) {
                    // Se a despesa foi marcada como paga, atualiza o visual na tela
                    atualizarStatusPago(despesaId);
                } else {
                    // Reporta um erro se não conseguiu marcar a despesa como paga
                    console.error('Falha ao atualizar o status da despesa:', data.error || 'Erro desconhecido');
                }
    
                // Recarrega a página para refletir as mudanças
                window.location.reload(true);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Log detalhado de erros de rede ou servidor
                console.error('Falha na requisição AJAX:', textStatus, errorThrown);
            },
        });
    }
    
    // Atualiza a interface do usuário para mostrar que a despesa foi paga
    function atualizarStatusPago(despesaId) {
        $(`#pago_${despesaId}`).prop('checked', true);
        $(`#pago_${despesaId}`).parent().css('color', 'green');
    }
    
    // Obtém o valor de um cookie pelo nome
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }  

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥ PAGAR DESPESA ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ DATA ATUAL ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

//  Retorna o ano atual.
function getDataAtual() {
    const dataAtual = new Date();
    const mes = dataAtual.getMonth() + 1; // getMonth() retorna mês de 0 a 11, então adiciona 1 para o formato humano
    const ano = dataAtual.getFullYear(); // getFullYear() retorna o ano completo
    console.log(dataAtual); // Log da data completa para referência de depuração
    return `${mes}/${ano}`; // Retorna a string no formato "mês/ano"
}

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥ DATA ATUAL ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ EXCLUIR DESPESA - MODAL ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

// Abre o modal de exclusão e preenche com os dados da despesa
function abrirModalExcluir(button) {
    var id = button.getAttribute('data-id');
    var nome = button.getAttribute('data-nome');
    var valor = button.getAttribute('data-valor');

    // Formata o valor da despesa para duas casas decimais para apresentação
    const valorFormatado = parseFloat(valor).toFixed(2);

    // Configura os dados da despesa nos elementos do modal
    $('#modalDelete').find('.modal-body p').html(`<strong>${nome}: ${valor}</strong>`);
    $('#modalDelete').find('.modal-footer .btn-danger').attr('onclick', `excluirDespesa(${id})`);
    $('#nomeDespesaModal').text(nome);

    // Mostra o modal de exclusão
    $('#modalDelete').modal('show');
}

// Executa a exclusão da despesa
function excluirDespesa(despesaId) {
    console.log('Excluir despesa com o ID:', despesaId);

    // Requisição AJAX para remover a despesa no servidor
    $.ajax({
        url: `/deletar/${despesaId}/`,
        type: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')  // Inclui o token CSRF para segurança
        },
        success: function(response) {
            // Informa sucesso e fecha o modal automaticamente após 2 segundos
            $('#modalMessage').text('Despesa excluída com sucesso!');
            setTimeout(() => {
                $('#modalDelete').modal('hide');
                setTimeout(() => {
                    window.location.reload(true);
                }, 2000);
            }, 2000);
        },
        error: function(xhr, status, error) {
            // Mostra mensagem de erro e registra detalhes do erro
            $('#modalMessage').text('Erro ao excluir a despesa: ' + error);
            console.log(xhr.responseText);
        }
    });
}

// Fecha o modal de exclusão sem realizar ações
function cancelarExclusao() {
    $('#modalDelete').modal('hide');
}

// Função auxiliar para obter o valor de um cookie específico
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Encontra o cookie correto e extrai seu valor
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥ EXCLUIR DESPESA - MODAL ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */


    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↧ SELETOR DE STATUS ↧ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */

// Retorna o mês atualmente selecionado pelo usuário
const getSelectedMonth = () => {
    const monthSelect = document.getElementById('mesSelect');
    return monthSelect ? monthSelect.value : null;
};

// Retorna o status de despesa selecionado no filtro
const getSelectedStatus = () => {
    const statusSelect = document.getElementById('statusFilter');
    return statusSelect ? statusSelect.value : null;
};

// Converte e formata a soma das despesas para o formato monetário brasileiro
const formatExpenseSum = (sum) => sum.toFixed(2).replace('.', ',');

// Atualiza o texto de um elemento HTML específico
const updateElementText = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
};

// Altera a visibilidade de um elemento baseado em uma condição booleana
const toggleElementVisibility = (id, condition) => {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = condition ? 'block' : 'none';
    }
};

// Retorna uma mensagem apropriada baseada no status de despesa selecionado
const getMessageForStatus = (status) => {
    switch (status) {
        case 'paga':
            return 'Não há despesas pagas para exibir neste mês!';
        case 'atrasada':
            return 'Não há despesas atrasadas para exibir neste mês!';
        case 'a_vencer':
            return 'Não há despesas à vencer neste mês!';
        default:
            return ''; // Caso não se encaixe em nenhuma categoria, não retorna mensagem
    }
};

// Aplica o filtro de status e mês nas despesas listadas
const applyStatusFilter = (selectedStatus) => {
    const selectedMonth = getSelectedMonth();
    let expenseSum = 0;
    const rows = document.querySelectorAll('.despesa-row');
    let hasExpenseOfType = false;

    // Processa cada linha de despesa para determinar quais exibir
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        const month = row.getAttribute('data-mes');
        const valueCell = row.cells[2].textContent;
        const numericValue = parseFloat(valueCell.replace(',', '.'));

        // Checa se o valor é numérico e filtra de acordo com o status e mês
        if (!isNaN(numericValue)) {
            if ((selectedStatus === '' || selectedStatus === status) && (selectedMonth === month)) {
                row.style.display = 'table-row';
                if (selectedStatus !== '') {
                    expenseSum += numericValue;
                }
                hasExpenseOfType = true;
            } else {
                row.style.display = 'none';
            }
        } else {
            console.warn(`Valor inválido encontrado: ${valueCell}`);
        }
    });

    // Atualiza o total de despesas e a visibilidade dos elementos de interface relacionados
    if (selectedStatus !== '') {
        const formattedExpenseSum = formatExpenseSum(expenseSum);
        updateElementText('totalSelect', formattedExpenseSum);
        toggleElementVisibility('totalDespesasDiv', expenseSum > 0);
    } else {
        updateElementText('totalSelect', '');
        toggleElementVisibility('totalDespesasDiv', false);
    }

    // Define e exibe uma mensagem baseada no status das despesas filtradas
    const messageElement = document.getElementById('mensagemDespesas');
    if (selectedStatus && selectedStatus !== '' && !hasExpenseOfType) {
        const message = getMessageForStatus(selectedStatus);
        messageElement.textContent = message;
        messageElement.style.color = 'brown';
        messageElement.style.display = 'block';
    } else {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
    }
};

// Inicia o filtro com o status inicialmente selecionado
applyStatusFilter(getSelectedStatus());


    /* ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ ↥ SELETOR DE STATUS ↥ ܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀܀ */


