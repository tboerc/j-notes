//Atributos
/*--- Funções Básicas do Site ---*/
let ajudaInicio = "<span>Nesta seção é possível ter uma noção prévia das atividades do dia atual, e também de todas atividades que não foram concluídas nos dias anteriores.</span>";
ajudaInicio += "<span>Ao clicar em alguma notificação, a página será redirecionada ao local indicado pela notificação.</span>";

let ajudaNova = "<span>Nesta seção pode-se criar uma nova tarefa, que será mais tarde mostrada no calendário, ou editar alguma já criada.</span>";
ajudaNova += '<span>Os itens com o indicador * são de preenchimento obrigatório.</span>';
ajudaNova += '<span>Caso tenha aberto a opção de editar por engano, clique no botão cancelar.</span>';

let ajudaCaledario = "<span>Nesta parte do site, o usuário tem acesso ao Calendário, local onde ele consegue ter controle sobre as tarefas que devem ser feitas, e as tarefas já concluidas.</span>";
ajudaCaledario += "<span>Os dias com marcas amarelas indicam que há tarefas a serem feitas.</span>";
ajudaCaledario += "<span>Os dias com marcas cinzas indicam que alguma tarefa foi concluída.</span>";
ajudaCaledario += "<span>Ao clicar em uma tarefa é possível obter mais informações sobre a mesma.</span>";
ajudaCaledario += "<span>Caso queira deletar ou editar uma tarefa, use os controladores que aparecem ao expandir uma.</span>";

let ajudaConcluir = "<span>Com essa seção, o usuário pode concluir uma tarefa informando dados essênciais para a geração de formulários do site.</span>";
ajudaConcluir += "<span>Nenhum dos dados são divulgados externamente, são de uso exclusivo apenas para a criação dos formulários.</span>";
ajudaConcluir += "<span>Os itens com o indicador * são de preenchimento obrigatório.<span>";

/*--- Nova Tarefa ---*/
let mascara = ['(00) 00000-0000', '(00) 0000-00009'];

/*--- Calendário ---*/
let hoje = new Date();
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();
let meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

//Main
$(function () {
    /* Variável vh para mobile, problema do autohide da barra de pesquisa solucionado */
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    /*--- Funções Básicas do Site ---*/

    /* Faz a fonte ser dinâmica, igual no css, porém aqui é possivel arredondar o valor, diminui chance de gliches */
    calcTamanhoFonte();
    $(window).resize(function () {
        calcTamanhoFonte();
    });

    /* Adiciona a classe active aos itens dos dois menus, quando clicar em algum deles, além de levar a página ao local desejado */
    $('#menu-movel, #menu-fixo').on('click', 'li', function (e) {
        scrollSpyClick(this, e);
    });

    /* Muda a classe active de acordo com o scroll da página */
    $(document).on('scroll', $.debounce(200, function () {
        scrollSpyNormal();
    }));

    /* Clicar no icone do menu abre ou fecha o menu */
    $(".btn-menu").click(function () {
        abreFechaMenuPrincipal();
    });

    /* Fecha o menu caso clique fora dele */
    $("main").click(function () {
        fechaMenuPrincipal();
    });

    /* Mostra a ajuda */
    $(".ajuda").click(function () {
        if ($(this).hasClass("inicio")) {
            $("#link-inicio").click();
            mostraAjuda(ajudaInicio);
        } else if ($(this).hasClass("nova-tarefa")) {
            $("#link-nova").click();
            mostraAjuda(ajudaNova);
        } else if ($(this).hasClass("calendario")) {
            $("#link-calendario").click();
            mostraAjuda(ajudaCaledario);
        } else {
            $("#link-concluir").click();
            mostraAjuda(ajudaConcluir);
        }
    });

    /* Fecha a ajuda quando clica fora dela */
    $(".overlay-ajuda").click(function () {
        fechaAjuda();
    });

    /* Previne a ajuda de ser fechada caso clique dentro da mesma */
    $(".overlay-ajuda div").click(function (e) {
        e.stopPropagation();
    });

    /*--- Nova Terfa ---*/

    /* Mascara para o telefone, usando o modelo brasileiro para celulares e telefones fixos */
    $(".telefone").mask(mascara[1], { //retirado da internet
        onKeyPress: function (val, e, field, options) {
            field.mask(val.length > 14 ? masks[0] : masks[1], options);
        }
    });

    /* Mascara para data */
    $(".data").mask("00/00/0000");

    /*--- Calendário ---*/

    /* Listeners para quando clicar nos botões de voltar e avançar mês */
    $("#volta-mes").click(function () {
        voltaMes();
    });
    $("#avanca-mes").click(function () {
        avancaMes();
    });

    /* Listener para mostrar a lista de anos */
    $("#mostra-lista-ano").click(function () {
        abreFechaListaAnos();
    });

    /* Listener para mudar o ano, e voltar a lista de anos */
    $(".box-lista-anos").on("click", "span", function () {
        mudaAno(this);
        abreFechaListaAnos();
    });

    /* Listener para mudar o dia selecionado */
    $("#corpo-calendario").on("click", ".box-dia", function () {
        mudaDiaSelecionado(this);
    });

    /* Listener para expandir o evento que for clicado */
    $("#box-painel-eventos").on("click", ".box-painel-eventos-item", function () {
        abreFechaItemEvento(this);
    });
});

//Secundários
/*--- Funções Básicas do Site ---*/
function calcTamanhoFonte() {
    let tamanho = Math.round(6 + ($(window).width() / 100) * 0.5);
    $("html").css('font-size', tamanho);
}

function abreFechaMenuPrincipal() {
    $(".div-menu-movel").addClass("div-menu-movel--animacao");
    if (!$(".div-menu-movel").hasClass("div-menu-movel--visivel")) {
        $(".div-menu-movel").addClass("div-menu-movel--visivel");
    } else {
        $(".div-menu-movel").removeClass("div-menu-movel--visivel");
    }
    $(".div-menu-movel").one("transitionend", function (e) {
        $(".div-menu-movel").removeClass("div-menu-movel--animacao");
    });
}

function fechaMenuPrincipal() {
    if ($(".div-menu-movel").hasClass("div-menu-movel--visivel")) {
        $(".div-menu-movel").addClass("div-menu-movel--animacao");
        $(".div-menu-movel").removeClass("div-menu-movel--visivel");
    }
    $(".div-menu-movel").one("transitionend", function (e) {
        $(".div-menu-movel").removeClass("div-menu-movel--animacao");
    });
}

function scrollSpyClick(item, e) {
    e.preventDefault();
    let i = $(item).index();

    if (i > 0 && i < 5) {
        $('#menu-movel li a, #menu-fixo li a').removeClass("active");
        $('#menu-fixo ul').children().eq(i).children().addClass("active");
        $('#menu-movel ul').children().eq(i).children().addClass("active");

        let id = $('#menu-fixo ul').children().eq(i).children().attr('href');
        let alvo = $(id).offset().top;
        if ($(window).width() <= 720) {
            $("html").scrollTop(alvo - transformaRemEmPx(5.5));
        } else {
            $("html").scrollTop(alvo);
        }
    }
}

function scrollSpyNormal() {
    $('.section-principal').each(function () {
        let id = $(this).attr('id'),
            areaHeight = $(this).outerHeight(),
            offset = $(this).offset().top,
            ajuste = window.innerHeight / 3,
            maxArea = offset + areaHeight,
            documentTop = $(document).scrollTop() + ajuste;
        if (documentTop > offset && documentTop < maxArea) {
            $('a[href="#' + id + '"]').addClass('active');
        } else {
            $('a[href="#' + id + '"]').removeClass('active')
        }
    });
}

function mostraAjuda(texto) {
    $(".overlay-ajuda div").empty();
    $(".overlay-ajuda").fadeIn().css('display', 'flex');
    $(".overlay-ajuda div").append(texto);
    $(".overlay-ajuda div").css('height', descobreTamanho - transformaRemEmPx(1));
}

function fechaAjuda() {
    $(".overlay-ajuda").fadeOut();
}

function transformaRemEmPx(valorEmRem) {
    return valorEmRem * parseInt($("html").css('font-size'));
}

function transformaPxEmRem(valorEmPx) {
    return valorEmPx / parseInt($("html").css('font-size'));
}

/*--- Calendário ---*/
function mostrarCalendario(mes, ano) {
    let primeiroDia = new Date(ano, mes).getDay();
    let totalDiasMes = new Date(ano, mes + 1, 0).getDate();
    $("#corpo-calendario").empty();
    $("#mes").text(meses[mes]);
    $("#ano").text(ano);
    let data = 1;
    for (let i = 0; i < 6; i++) {
        let linha = "<tr>";
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < primeiroDia) || (data > totalDiasMes)) {
                //caso esteja na primeira semana e o dia for menor que o primeiro dia, colocar td vazio
                //caso esteja na ultima semana, e o mês já tiver acabado, coloca o td vazio para dar o tamanho certo
                linha += "<td></td>";
            } else {
                linha += "<td><span class='box-dia dia-normal ";
                if (j === 0 || j === 6) {
                    linha += "dia-final-semana ";
                }
                if (data === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()) {
                    linha += "dia-evento";
                }
                linha += "'>" + data + "</span></td>";
                data++;
            }
        }
        linha += "</tr>"
        $("#corpo-calendario").append(linha);
    }
}

function avancaMes() {
    anoAtual = (mesAtual === 11) ? anoAtual + 1 : anoAtual;
    mesAtual = (mesAtual + 1) % 12;
    mostrarCalendario(mesAtual, anoAtual);
}

function voltaMes() {
    anoAtual = (mesAtual === 0) ? anoAtual - 1 : anoAtual;
    mesAtual = (mesAtual === 0) ? 11 : mesAtual - 1;
    mostrarCalendario(mesAtual, anoAtual);
}

function abreFechaListaAnos() {
    $(".wrapper-lista-anos").addClass("wrapper-lista-anos--animacao");
    $("#mostra-lista-ano").addClass("ano--animacao");

    if (!$(".wrapper-lista-anos").hasClass("wrapper-lista-anos--visivel")) {
        $(".wrapper-lista-anos").addClass("wrapper-lista-anos--visivel");
        $("#mostra-lista-ano").css('transform', 'rotate(-180deg)');
    } else {
        $(".wrapper-lista-anos").removeClass("wrapper-lista-anos--visivel");
        $("#mostra-lista-ano").css('transform', 'none');
    }
    $(".wrapper-lista-anos").one("transitionend", function (e) {
        $(".wrapper-lista-anos").removeClass("wrapper-lista-anos--animacao");
        $("#mostra-lista-ano").removeClass("ano--animacao");
    });
}

function mudaAno(ano) {
    anoAtual = parseInt($(ano).text());
    mostrarCalendario(mesAtual, anoAtual);
}

function mudaDiaSelecionado(o) {
    $(".box-dia").removeClass("dia-evento");
    $(o).addClass("dia-evento");
}

function abreFechaItemEvento(item) {
    $(".box-painel-eventos-item").addClass("box-painel-eventos-item--animacao");
    if (transformaPxEmRem($(item).innerHeight()) == 5) {
        $(".box-painel-eventos-item").css('height', '5rem');
        $(item).css('height', descobreTamanho(item));
    } else {
        $(item).css('height', '5rem');
    }
    $(".box-painel-eventos-item").one("transitionend", function (e) {
        $(".box-painel-eventos-item").removeClass("box-painel-eventos-item--animacao");
    });
}

function descobreTamanho(item) {
    let tamanho = 0;
    for (let i = 0; i < $(item).children().length; i++) {
        tamanho += $(item).children().eq(i).outerHeight(true);
    }
    return tamanho + transformaRemEmPx(1);
}