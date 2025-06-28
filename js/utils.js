// js/utils.js

/**
 * Destaca todas as ocorrências de `word` dentro de `text`
 * envolvendo-as em <span class="highlight">…</span>
 */
function highlight(text = '', word = '') {
  if (!word) return text;
  // escapa caracteres especiais para o RegExp
  const esc = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${esc})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Formata um número como moeda brasileira: R$ 1.234.567,89
 */
function formatPrice(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Recebe um CEP (string de 8 dígitos ou já formatada)
 * e retorna no padrão 00000-000
 */
function formatCEP(cep = '') {
  const digits = cep.replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Monta um link para abrir no Google Maps a partir de um endereço
 */
function buildMapsLink(address = '') {
  const q = encodeURIComponent(address);
  return `https://maps.google.com/?q=${q}`;
}

/**
 * Monta um link do WhatsApp já com mensagem pronta.
 * @param {string} phone – Número no formato '54999832413' (código país + DDD + número).
 * @param {string} text  – Texto da mensagem; será codificado com encodeURIComponent.
 * @returns {string} URL completa para iniciar conversa no WhatsApp.
 */
function buildWhatsAppLink(phone, text) {
  const msg = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${msg}`;
}

// Se estiver usando módulos ES, você pode exportar:
// export { highlight, formatPrice, formatCEP, buildMapsLink, buildWhatsAppLink };
