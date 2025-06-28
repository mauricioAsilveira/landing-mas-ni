// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const JSON_URL = 'imoveis.json';
  const container = document.getElementById('imoveis-container');
  if (!container) return console.error('Elemento #imoveis-container não encontrado.');

  fetch(JSON_URL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      const imobs = Array.isArray(data.imobs) ? data.imobs : [];
      container.innerHTML = imobs.length
        ? imobs.map(renderImovel).join('')
        : '<p>Nenhum imóvel encontrado.</p>';
    })
    .catch(err => {
      console.error('Erro ao carregar imóveis:', err);
      container.innerHTML = `<p class="error">Erro ao carregar imóveis: ${err.message}</p>`;
    });

  function highlight(text, word) {
    if (!word) return text;
    const esc = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return text.replace(new RegExp(`(${esc})`, 'gi'), '<span class="highlight">$1</span>');
  }

  function formatPrice(val) {
    return Number(val).toLocaleString('pt-BR',{ style:'currency',currency:'BRL' });
  }

  function renderImovel(im) {
    const end = `${im.endereco.rua}, Unidade ${im.endereco.unidade} – `
              + `${im.endereco.bairro}, ${im.endereco.cidade}`;
    const galeria = (im.fotos||[]).map(src =>
      `<img src="${src}" alt="${im.titulo}">`
    ).join('');
    // aqui criei specs como array de strings pra manter seu template original
    const specs = [
      `Valor: ${formatPrice(im.valor)}`,
      `Perfil: ${im.perfil}`,
      `Área Construída: ${im.areaConstruida||'–'} m²`,
      `Área Terreno: ${im.terreno||'–'} m²`,
      `Vagas: ${im.vagas||0}`,
      `Lavabos: ${im.lavabos||0}`,
      `Elevador: ${im.elevador||'–'}`
    ].map(txt => `<div class="caracteristica">${txt}</div>`).join('');

    const waLink = `https://wa.me/549999832413?text=${encodeURIComponent(
      `Olá Mauricio, tenho interesse no imóvel (ID:${im.id})`
    )}`;

    return `
      <article class="imovel">
        <h1>${highlight(im.titulo, im.palavraDestaque)}</h1>
        <div class="galeria">${galeria}</div>
        <ul class="info-geral">
          <li><strong>Endereço:</strong> ${end}</li>
          <li><strong>CEP:</strong> ${im.endereco.cep}</li>
          <li><strong>Próximo a:</strong> ${im.proximo||'–'}</li>
        </ul>
        <div class="caracteristicas">${specs}</div>
        <div class="cta">
          <a class="btn btn-whatsapp"
             href="${waLink}"
             target="_blank">
            Falar no WhatsApp
          </a>
          <div class="btn-redes">
            <a href="https://www.facebook.com/MauricioSilveira1962/" target="_blank">Facebook</a>
            <a href="https://www.instagram.com/@mascorretor" target="_blank">Instagram</a>
            <a href="https://www.threads.net/@mascorretor" target="_blank">Threads</a>
          </div>
        </div>
      </article>
    `;
  }
});
