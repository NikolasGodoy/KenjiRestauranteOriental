/* ============================================================
   KENJI RESTAURANTE ORIENTAL — Script Principal
   Estruturas: if / else if / else, for, while
   DOM: apenas getElementById
   ============================================================ */


/* ======= VARIÁVEIS GLOBAIS ======= */
let navBar            = null;
let revealElements    = null;
let mobileNavLinks    = null;
let mobileNavCollapse = null;
let btnTopo           = null;
let barraProgresso    = null;
let contadoresJaAtivados = false;

let SCROLL_THRESHOLD  = 60;
let SCROLL_BTN_TOPO   = 400;
let REVEAL_DELAY_STEP = 80;
let OBSERVER_THRESHOLD = 0.12;
let totalRevealados   = 0;

let filtroDeliveryAtivo = 'todos';

let TAB_IDS = [
  'tab-entradas',
  'tab-teishoku',
  'tab-kare',
  'tab-domburi',
  'tab-macarrao',
  'tab-bento',
  'tab-veg',
  'tab-bebidas'
];

let filtroCardapioDeliveryAtivo = 'cd-todos';


/* ======= INICIALIZAÇÃO ======= */
function init() {
  initNavBar();
  initReveal();
  initMobileNav();
  initAnoFooter();
  initBarraProgresso();
  initBtnTopo();
  initContadores();
  initBusca();
}


/* ======= NAVBAR ======= */
function initNavBar() {
  navBar = document.getElementById('mainNav');

  if (navBar !== null) {
    window.addEventListener('scroll', handleNavScroll);
  }
}

function handleNavScroll() {
  let scrollAtual = window.scrollY;

  if (scrollAtual > SCROLL_THRESHOLD) {
    navBar.classList.add('scrolled');
  } else {
    navBar.classList.remove('scrolled');
  }
}


/* ======= SCROLL REVEAL ======= */
function initReveal() {
  revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    let opcoes = {
      threshold: OBSERVER_THRESHOLD
    };

    let observer = new IntersectionObserver(handleRevealEntries, opcoes);

    for (let i = 0; i < revealElements.length; i = i + 1) {
      observer.observe(revealElements[i]);
    }
  }
}

function handleRevealEntries(entries, observer) {
  for (let i = 0; i < entries.length; i = i + 1) {
    let entry = entries[i];

    if (entry.isIntersecting === true) {
      revelarElemento(entry.target, i);
      observer.unobserve(entry.target);

      totalRevealados = totalRevealados + 1;
    }
  }
}

function revelarElemento(elemento, indice) {
  let atraso = indice * REVEAL_DELAY_STEP;

  setTimeout(function () {
    elemento.classList.add('visible');
  }, atraso);
}

function calcularAtraso(indice) {
  let atrasoBase  = REVEAL_DELAY_STEP;
  let atrasoTotal = atrasoBase * indice;
  return atrasoTotal;
}


/* ======= MENU MOBILE — FECHAR AO CLICAR NO LINK ======= */
function initMobileNav() {
  mobileNavLinks    = document.querySelectorAll('.nav-link-kenji');
  mobileNavCollapse = document.getElementById('navMenu');

  if (mobileNavLinks.length > 0) {
    for (let i = 0; i < mobileNavLinks.length; i = i + 1) {
      mobileNavLinks[i].addEventListener('click', handleNavLinkClick);
    }
  }
}

function handleNavLinkClick() {
  let larguraTela = window.innerWidth;

  if (larguraTela < 992) {
    fecharMenuMobile();
  }
}

function fecharMenuMobile() {
  if (mobileNavCollapse !== null) {
    let instancia = bootstrap.Collapse.getInstance(mobileNavCollapse);

    if (instancia !== null) {
      instancia.hide();
    }
  }
}


/* ======= ANO DINÂMICO NO FOOTER ======= */
function initAnoFooter() {
  let elementoAno = document.getElementById('anoFooter');

  if (elementoAno !== null) {
    let anoAtual = new Date().getFullYear();
    elementoAno.textContent = anoAtual;
  }
}


/* ======= VERIFICAR SEÇÃO ATIVA NA NAVBAR ======= */
function initScrollSpy() {
  let secoes  = document.querySelectorAll('section[id]');
  let navLinks = document.querySelectorAll('.nav-link-kenji');

  if (secoes.length > 0) {
    window.addEventListener('scroll', function () {
      atualizarLinkAtivo(secoes, navLinks);
    });
  }
}

function atualizarLinkAtivo(secoes, navLinks) {
  let scrollY      = window.scrollY;
  let alturaOffset = 100;
  let secaoAtiva   = '';

  for (let i = 0; i < secoes.length; i = i + 1) {
    let secao     = secoes[i];
    let topoSecao = secao.offsetTop - alturaOffset;
    let alturaSecao = secao.offsetHeight;
    let fimSecao  = topoSecao + alturaSecao;

    if (scrollY >= topoSecao && scrollY < fimSecao) {
      secaoAtiva = secao.getAttribute('id');
    }
  }

  for (let j = 0; j < navLinks.length; j = j + 1) {
    let link = navLinks[j];
    let href = link.getAttribute('href');

    if (href === '#' + secaoAtiva) {
      link.classList.add('ativo');
    } else {
      link.classList.remove('ativo');
    }
  }
}


/* ======= VERIFICAR STATUS DO RESTAURANTE (ABERTO / FECHADO) ======= */
function verificarStatusRestaurante() {
  let agora     = new Date();
  let diaSemana = agora.getDay();
  let hora      = agora.getHours();
  let minuto    = agora.getMinutes();

  let horaEmMinutos = hora * 60 + minuto;

  let abertura   = 11 * 60;      /* 11h00 */
  let fechamento = 15 * 60;      /* 15h00 */

  let statusElemento = document.getElementById('statusRestaurante');

  if (statusElemento === null) {
    return;
  }

  /* Sábado: fechado */
  if (diaSemana === 6) {
    statusElemento.textContent = 'Fechado hoje (sábado)';
    statusElemento.style.color = 'var(--red)';
    return;
  }

  if (horaEmMinutos >= abertura && horaEmMinutos < fechamento) {
    statusElemento.textContent = 'Aberto agora';
    statusElemento.style.color = '#4CAF50';
  } else if (horaEmMinutos < abertura) {
    let minutosParaAbrir = abertura - horaEmMinutos;
    let horasRestantes   = Math.floor(minutosParaAbrir / 60);
    let minutosRestantes = minutosParaAbrir - horasRestantes * 60;

    if (horasRestantes > 0) {
      statusElemento.textContent = 'Fechado • Abre em ' + horasRestantes + 'h' + minutosRestantes + 'min';
    } else {
      statusElemento.textContent = 'Fechado • Abre em ' + minutosRestantes + ' min';
    }

    statusElemento.style.color = 'var(--grey)';
  } else {
    statusElemento.textContent = 'Fechado no momento';
    statusElemento.style.color = 'var(--red)';
  }
}


/* ======= BARRA DE PROGRESSO DE LEITURA ======= */
function initBarraProgresso() {
  barraProgresso = document.getElementById('barraProgresso');

  if (barraProgresso !== null) {
    window.addEventListener('scroll', atualizarBarraProgresso);
  }
}

function atualizarBarraProgresso() {
  let scrollAtual  = window.scrollY;
  let alturaTotal  = document.body.scrollHeight - window.innerHeight;
  let porcentagem  = 0;

  if (alturaTotal > 0) {
    porcentagem = (scrollAtual / alturaTotal) * 100;
  }

  if (porcentagem > 100) {
    porcentagem = 100;
  } else if (porcentagem < 0) {
    porcentagem = 0;
  }

  barraProgresso.style.width = porcentagem + '%';
}


/* ======= BOTÃO VOLTAR AO TOPO ======= */
function initBtnTopo() {
  btnTopo = document.getElementById('btnTopo');

  if (btnTopo !== null) {
    window.addEventListener('scroll', verificarBtnTopo);
    btnTopo.addEventListener('click', voltarAoTopo);
  }
}

function verificarBtnTopo() {
  if (window.scrollY > SCROLL_BTN_TOPO) {
    btnTopo.classList.add('visivel');
  } else {
    btnTopo.classList.remove('visivel');
  }
}

function voltarAoTopo() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ======= CONTADORES ANIMADOS (usa while) ======= */
function initContadores() {
  let statsRow = document.getElementById('statsRow');

  if (statsRow !== null) {
    let observer = new IntersectionObserver(function (entries) {
      let i = 0;
      for (i = 0; i < entries.length; i = i + 1) {
        if (entries[i].isIntersecting === true && contadoresJaAtivados === false) {
          contadoresJaAtivados = true;
          animarContador('contPratos',   45,  '',  '+');
          animarContador('contAnos',      7,  '',  ' anos');
          animarContador('contClientes', 500, '', '+');
        }
      }
    }, { threshold: 0.4 });

    observer.observe(statsRow);
  }
}

function animarContador(id, valorFinal, prefixo, sufixo) {
  let elemento = document.getElementById(id);

  if (elemento === null) {
    return;
  }

  let atual      = 0;
  let incremento = Math.ceil(valorFinal / 40);

  let intervalo = setInterval(function () {
    /* while: avança em blocos até alcançar o valor final */
    while (atual < valorFinal) {
      atual = atual + incremento;

      if (atual >= valorFinal) {
        atual = valorFinal;
      }

      elemento.textContent = prefixo + atual + sufixo;
      break; /* pausa após cada incremento para o setInterval criar a animação */
    }

    if (atual >= valorFinal) {
      elemento.textContent = prefixo + valorFinal + sufixo;
      clearInterval(intervalo);
    }
  }, 30);
}


/* ======= BUSCA NO CARDÁPIO (usa while + for) ======= */
function initBusca() {
  let campo = document.getElementById('campoBusca');

  if (campo !== null) {
    campo.addEventListener('input', function () {
      let termo = campo.value.trim();
      filtrarCardapio(termo);
    });
  }
}

function filtrarCardapio(termo) {
  let painelBusca       = document.getElementById('painelBusca');
  let tabsNav           = document.getElementById('menuTabs');
  let tabContent        = document.getElementById('tabContentCardapio');
  let resultadoBusca    = document.getElementById('resultadoBusca');

  /* Sem texto: volta ao modo normal */
  if (termo.length === 0) {
    if (painelBusca !== null)    { painelBusca.style.display = 'none'; painelBusca.innerHTML = ''; }
    if (tabsNav !== null)        { tabsNav.style.display = ''; }
    if (tabContent !== null)     { tabContent.style.display = ''; }
    if (resultadoBusca !== null) { resultadoBusca.textContent = ''; resultadoBusca.style.display = 'none'; }
    return;
  }

  /* Ocultar tabs normais, exibir painel de busca */
  if (tabsNav !== null)    { tabsNav.style.display = 'none'; }
  if (tabContent !== null) { tabContent.style.display = 'none'; }

  if (painelBusca !== null) {
    painelBusca.innerHTML = '';
    painelBusca.style.display = 'flex';
    painelBusca.style.flexWrap = 'wrap';
    painelBusca.style.gap = '12px';
  }

  let totalEncontrados = 0;
  let termoLower       = termo.toLowerCase();
  let i                = 0;

  /* WHILE: percorre cada tab do cardápio */
  while (i < TAB_IDS.length) {
    let pane = document.getElementById(TAB_IDS[i]);

    if (pane !== null) {
      let itens = pane.getElementsByClassName('menu-item');

      /* FOR: percorre cada item dentro da tab */
      for (let j = 0; j < itens.length; j = j + 1) {
        let nomeEl = itens[j].getElementsByClassName('menu-item-name')[0];
        let descEl = itens[j].getElementsByClassName('menu-item-desc')[0];

        let textoNome = '';
        let textoDesc = '';

        if (nomeEl !== undefined) {
          textoNome = nomeEl.textContent.toLowerCase();
        }

        if (descEl !== undefined) {
          textoDesc = descEl.textContent.toLowerCase();
        }

        /* IF/ELSE IF/ELSE: decide se o item aparece */
        if (textoNome.indexOf(termoLower) !== -1) {
          /* nome bate — prioridade alta */
          let clone = itens[j].cloneNode(true);
          clone.style.flex = '1 1 280px';
          clone.style.maxWidth = '420px';
          if (painelBusca !== null) {
            painelBusca.appendChild(clone);
          }
          totalEncontrados = totalEncontrados + 1;
        } else if (textoDesc.indexOf(termoLower) !== -1) {
          /* descrição bate — inclui também */
          let cloneDesc = itens[j].cloneNode(true);
          cloneDesc.style.flex = '1 1 280px';
          cloneDesc.style.maxWidth = '420px';
          cloneDesc.style.opacity = '0.85';
          if (painelBusca !== null) {
            painelBusca.appendChild(cloneDesc);
          }
          totalEncontrados = totalEncontrados + 1;
        }
      }
    }

    i = i + 1;
  }

  /* Exibir contagem de resultados */
  if (resultadoBusca !== null) {
    resultadoBusca.style.display = 'block';

    if (totalEncontrados === 0) {
      resultadoBusca.textContent = 'Nenhum prato encontrado para "' + termo + '"';
      resultadoBusca.style.color = 'var(--red)';
    } else if (totalEncontrados === 1) {
      resultadoBusca.textContent = '1 prato encontrado';
      resultadoBusca.style.color = '#4CAF50';
    } else {
      resultadoBusca.textContent = totalEncontrados + ' pratos encontrados';
      resultadoBusca.style.color = '#4CAF50';
    }
  }
}


/* ======= FILTRO DE DELIVERY (usa while + for + if/else if/else) ======= */
function initDeliveryFilter() {
  let filtroContainer = document.getElementById('deliveryFilter');

  if (filtroContainer === null) {
    return;
  }

  let botoes = filtroContainer.getElementsByClassName('df-btn');

  /* FOR: registra o evento de clique em cada botão de categoria */
  for (let i = 0; i < botoes.length; i = i + 1) {
    botoes[i].addEventListener('click', handleDeliveryFilter);
  }
}

function handleDeliveryFilter(evento) {
  let categoriaSelecionada = evento.target.getAttribute('data-filter');
  let filtroContainer      = document.getElementById('deliveryFilter');
  let grid                 = document.getElementById('deliveryGrid');

  if (categoriaSelecionada === null) {
    return;
  }

  /* Atualizar botão ativo */
  if (filtroContainer !== null) {
    let botoes = filtroContainer.getElementsByClassName('df-btn');

    for (let i = 0; i < botoes.length; i = i + 1) {
      if (botoes[i].getAttribute('data-filter') === categoriaSelecionada) {
        botoes[i].classList.add('active');
      } else {
        botoes[i].classList.remove('active');
      }
    }
  }

  /* Filtrar os cards do grid usando while */
  if (grid !== null) {
    let cards = grid.children;
    let j     = 0;

    /* WHILE: percorre todos os cards do grid */
    while (j < cards.length) {
      let categoriaCard = cards[j].getAttribute('data-category');

      /* IF / ELSE IF / ELSE: decide qual card mostrar */
      if (categoriaSelecionada === 'todos') {
        /* Mostrar todos */
        cards[j].style.display = '';
        cards[j].style.animation = 'fadeInCard 0.3s ease forwards';
      } else if (categoriaCard === categoriaSelecionada) {
        /* Categoria bate — mostrar */
        cards[j].style.display = '';
        cards[j].style.animation = 'fadeInCard 0.3s ease forwards';
      } else {
        /* Categoria diferente — esconder */
        cards[j].style.display = 'none';
        cards[j].style.animation = '';
      }

      j = j + 1;
    }
  }

  filtroDeliveryAtivo = categoriaSelecionada;
}


/* ======= FILTRO DELIVERY NO CARDÁPIO (pane-delivery-menu) ======= */
function initCardapioDeliveryFilter() {
  let filtroContainer = document.getElementById('cardapioDeliveryFilter');

  if (filtroContainer === null) {
    return;
  }

  let botoes = filtroContainer.getElementsByClassName('df-btn');

  for (let i = 0; i < botoes.length; i = i + 1) {
    botoes[i].addEventListener('click', handleCardapioDeliveryFilter);
  }
}

function handleCardapioDeliveryFilter(evento) {
  let categoriaSelecionada = evento.target.getAttribute('data-filter');
  let filtroContainer      = document.getElementById('cardapioDeliveryFilter');
  let grid                 = document.getElementById('cardapioDeliveryGrid');

  if (categoriaSelecionada === null) {
    return;
  }

  if (filtroContainer !== null) {
    let botoes = filtroContainer.getElementsByClassName('df-btn');

    for (let i = 0; i < botoes.length; i = i + 1) {
      if (botoes[i].getAttribute('data-filter') === categoriaSelecionada) {
        botoes[i].classList.add('active');
      } else {
        botoes[i].classList.remove('active');
      }
    }
  }

  if (grid !== null) {
    let cards = grid.children;
    let j     = 0;

    while (j < cards.length) {
      let categoriaCard = cards[j].getAttribute('data-category');

      if (categoriaSelecionada === 'cd-todos') {
        cards[j].style.display = '';
        cards[j].style.animation = 'fadeInCard 0.3s ease forwards';
      } else if (categoriaCard === categoriaSelecionada) {
        cards[j].style.display = '';
        cards[j].style.animation = 'fadeInCard 0.3s ease forwards';
      } else {
        cards[j].style.display = 'none';
        cards[j].style.animation = '';
      }

      j = j + 1;
    }
  }

  filtroCardapioDeliveryAtivo = categoriaSelecionada;
}


/* ======= EXECUTAR AO CARREGAR A PÁGINA ======= */
window.addEventListener('DOMContentLoaded', function () {
  init();
  initScrollSpy();
  verificarStatusRestaurante();
  initDeliveryFilter();
  initCardapioDeliveryFilter();

  // Agendamento: carregado via js/agendamento.js (página específica)
});

