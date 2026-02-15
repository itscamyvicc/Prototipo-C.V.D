// =============================================
//  C.V.D — Gerenciador de Navegação SPA
// =============================================

const conteudo = document.getElementById('conteudo-principal');

// Mapa de telas: chave = data-tela, valor = caminho do arquivo HTML
const telas = {
    dashboard:      '/telas/dashboard.html',
    profissionais:  '/telas/profissionais.html',
    documentos:     '/telas/documentos.html',
    alertas:        '/telas/alertas.html',
    dados:          '/telas/dados.html',
    configuracoes:  '/telas/config.html',  
};

// CSS específico de cada tela (carregados dinamicamente)
const cssTelas = {
    dashboard:      '/css/dashboard.css',
    profissionais:  '/css/profissionais.css',
    documentos:     '/css/documentos.css',
    alertas:        '/css/alertas.css',
    dados:          '/css/dados.css',
    configuracoes:  '/css/config.css',
};

// CSS já carregados (evita duplicatas)
const cssCarregados = new Set();

// Tela atualmente ativa
let telaAtiva = null;

// -----------------------------------------------
//  Carrega o CSS de uma tela dinamicamente
// -----------------------------------------------
function carregarCSS(tela) {
    const href = cssTelas[tela];
    if (!href || cssCarregados.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    cssCarregados.add(href);
}

// -----------------------------------------------
//  Carrega o HTML de uma tela via fetch
// -----------------------------------------------
async function carregarTela(tela) {
    if (tela === telaAtiva && !forcarReload) return;

    const caminho = telas[tela];

    // Telas ainda não implementadas
    if (!caminho) {
        conteudo.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;gap:12px;color:#999;">
                <i class='bx bx-wrench' style="font-size:48px;"></i>
                <p style="font-size:15px;">Esta seção ainda está em desenvolvimento.</p>
            </div>`;
        atualizarMenuAtivo(tela);
        telaAtiva = tela;
        return;
    }

    // Mostra indicador de carregamento
    conteudo.innerHTML = `<div class="loading-tela">Carregando...</div>`;

    try {
        const resposta = await fetch(caminho);

        if (!resposta.ok) throw new Error(`Erro ao carregar ${caminho}`);

        const html = await resposta.text();

        // Extrai apenas o conteúdo do <body>
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyContent = doc.body.innerHTML;

        // Injeta o conteúdo na área principal
        conteudo.innerHTML = bodyContent;

        // Carrega o CSS específico da tela
        carregarCSS(tela);

        // Re-executa os scripts da tela carregada
        // Scripts externos são aguardados antes de executar os inline
        // Scripts inline são isolados em IIFE para evitar conflito de variáveis entre telas
        const scripts = Array.from(conteudo.querySelectorAll('script'));
        for (const scriptAntigo of scripts) {
            const scriptNovo = document.createElement('script');
            if (scriptAntigo.src) {
                await new Promise((resolve) => {
                    scriptNovo.src = scriptAntigo.src;
                    scriptNovo.onload = resolve;
                    scriptNovo.onerror = resolve;
                    document.body.appendChild(scriptNovo);
                });
            } else {
                scriptNovo.textContent = `(function(){\n${scriptAntigo.textContent}\n})();`;
                document.body.appendChild(scriptNovo);
            }
            scriptAntigo.remove();
        }

        atualizarMenuAtivo(tela);
        telaAtiva = tela;

        // Rola para o topo ao trocar de tela
        conteudo.scrollTop = 0;

    } catch (erro) {
        console.error(erro);
        conteudo.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:300px;gap:12px;color:#c0392b;">
                <i class='bx bx-error-circle' style="font-size:48px;"></i>
                <p style="font-size:15px;">Não foi possível carregar a tela. Verifique o console.</p>
            </div>`;
    }
}

// -----------------------------------------------
//  Atualiza o item ativo no menu lateral
// -----------------------------------------------
function atualizarMenuAtivo(tela) {
    document.querySelectorAll('.nav-link a[data-tela]').forEach(link => {
        link.classList.remove('ativo');
        if (link.dataset.tela === tela) {
            link.classList.add('ativo');
        }
    });
}

// -----------------------------------------------
//  Event listeners dos itens do menu
// -----------------------------------------------
document.querySelectorAll('.nav-link a[data-tela]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        carregarTela(link.dataset.tela);
    });
});

// -----------------------------------------------
//  Carrega o Dashboard ao iniciar
// -----------------------------------------------
carregarTela('dashboard');