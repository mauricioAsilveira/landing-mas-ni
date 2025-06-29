// js/utils.js
'use strict';

/**
 * Escapa caracteres especiais para uso seguro em RegExp.
 * @param {string} str
 * @returns {string}
 */
function escapeRegExp(str = '') {
  return str.replace(/[.*+?^${}()|[\]

\/\

\[\]

{}]/g, '\\$&');
}

/**
 * Destaca todas as ocorrências de `word` dentro de `text`,
 * envolvendo-as em <span class="highlight">…</span>
 * @param {string} text
 * @param {string} word
 * @returns {string}
 */
function highlight(text = '', word = '') {
  if (!word) return text;
  const esc = escapeRegExp(word);
  const regex = new RegExp(`(${esc})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Formata um número como moeda brasileira, ex: 1500000 → "R$ 1.500.000,00"
 * @param {number|string} value
 * @returns {string}
 */
function formatPrice(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Recebe um CEP e retorna no padrão "00000-000".
 * @param {string} cep — string com 8 dígitos ou já formatada
 * @returns {string}
 */
function formatCEP(cep = '') {
  const digits = cep.replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
  return digits.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Gera link para o Google Maps a partir de um endereço.
 * @param {string} address
 * @returns {string}
 */
function buildMapsLink(address = '') {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

/**
 * Monta um link para iniciar conversa no WhatsApp.
 * @param {string} phone — número no formato "54999832413" (DDD + número)
 * @param {string} text — mensagem livre
 * @returns {string}
 */
function buildWhatsAppLink(phone = '', text = '') {
  const num = phone.replace(/\D/g, '');
  const msg = encodeURIComponent(text);
  return `https://wa.me/${num}?text=${msg}`;
}

// Se você quiser expor globalmente:
window.Utils = {
  escapeRegExp,
  highlight,
  formatPrice,
  formatCEP,
  buildMapsLink,
  buildWhatsAppLink
};

// Se estiver usando módulos ES:
// export {
//   escapeRegExp,
//   highlight,
//   formatPrice,
//   formatCEP,
//   buildMapsLink,
//   buildWhatsAppLink
// };
