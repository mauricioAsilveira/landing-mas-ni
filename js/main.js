// js/main.js
'use strict';

(() => {
  // 1) Caminho para seu JSON de imóveis
  const JSON_URL = './imoveis.json';

  // 2) Função para escapar caracteres especiais em regex
  function escapeRegExp(str = '') {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // 3) Destacar palavra-chave dentro do título
  function highlight(text, word) {
    if (!word) return text;
    const esc = escapeRegExp(word);
    const regex = new RegExp(`(${esc})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  }

  // 4) Monta o HTML para um imóvel
  function renderImovel(im) {
    // Endereço formatado
    const endParts = [
      im.endereco.rua,
      im.endereco.unidade ? `Unid. ${im.endereco.unidade}` : null,
      im.endereco.bairro,
      im.endereco.cidade
    ].filter(Boolean).join(' – ');

    // Galeria de imagens ou mensagem fallback
    const galeriaHTML = Array.isArray(im.fotos) && im.fotos.length
      ? im.fotos.map((src, i) =>
          `<img src="${src}" alt="Foto ${i + 1} de ${im.titulo}" loading="lazy">`
        ).join('')
      : '<p>Sem imagens disponíveis.</p>';

    // Ficha técnica
    const specsArr = [
      `Valor: R$ ${im.valor.toLocaleString('pt-BR')}`,
      `Perfil: ${im.perfil}`,
      `Área Terreno: ${im.terreno ?? '–'} m²`,
      `Área Const.: ${im.areaConstruida ?? '–'} m²`,
      `Vagas: ${im.vagas ?? 0}`,
      `Lavabos: ${im.lavabos ?? 0}`,
      `Elevador: ${im.elevador ?? '–'}`
    ];
    if (im.complemento) specsArr.push(`Complemento: ${im.complemento}`);
    const specsHTML = specsArr
      .map(item => `<div class="caracteristica">${item}</div>`)
      .join('');

    // Mensagem personalizada para o WhatsApp
    const whatsappMsg = encodeURIComponent(
      `Olá Mauricio, tenho interesse nesse imóvel (ID: ${im.id})`
    );
    const whatsappNum = im.whatsapp || '549999832413';

    // Montagem final do template
    return `
      <article class="imovel">
        <h2>${highlight(im.titulo, im.palavraDestaque)}</h2>
        <div class="galeria">${galeriaHTML}</div>
        <ul class="info-geral">
          <li><strong>Endereço:</strong> ${endParts}</li>
          <li><strong>CEP:</strong> ${im.endereco.cep}</li>
          <li><strong>Próximo a:</strong> ${im.proximo || '–'}</li>
        </ul>
        <div class="caracteristicas">${specsHTML}</div>
        <div class="cta">
          <a
            class="btn btn-whatsapp"
  href="https://wa.me/${whatsappNum}?text=${whatsappMsg}"
  target="_blank"
  rel="noopener noreferrer"
>
  Falar no WhatsApp
          <div class="btn-redes">
            <a href="https://www.facebook.com/MauricioSilveira1962/" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com/@mascorretor" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.threads.net/@mascorretor" target="_blank" rel="noopener noreferrer">Threads</a>
          </div>
        </div>
      </article>
    `;
  }

  // 5) Carrega e renderiza todos os imóveis no DOM
  function loadImoveis() {
    const container = document.getElementById('imoveis-container');
    if (!container) return;

    fetch(JSON_URL)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const list = data.imobs || data.imoveis || [];
        container.innerHTML = list.length
          ? list.map(renderImovel).join('')
          : '<p>Nenhum imóvel encontrado.</p>';
      })
      .catch(err => {
        container.innerHTML = `<p>Erro ao carregar imóveis: ${err.message}</p>`;
        console.error('Erro no fetch de imóveis:', err);
      });
  }

  // 6) Inicialização após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadImoveis);
  } else {
    loadImoveis();
  }
})();
