/* BETI — comportamiento compartido por todas las vistas */

// Número de WhatsApp en formato internacional, sin "+" ni espacios (ej. Perú: 51 + 9 dígitos).
const BETI_WHATSAPP = '51956387508';

const waLink = (msg) => `https://wa.me/${BETI_WHATSAPP}?text=${encodeURIComponent(msg)}`;

document.addEventListener('DOMContentLoaded', () => {
  // Enlaces de WhatsApp: <a data-wa="mensaje">
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa || 'Hola, quiero información de PULSO+');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Menú móvil
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Cerrar' : 'Menú';
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Entrada suave de bloques
  const items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('is-in'));
  }

  // Formulario de pedido → WhatsApp
  const form = document.querySelector('#pedido-form');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const d = new FormData(form);
      const lines = [
        '¡Hola Beti! Quiero pedir PULSO+',
        `• Pack: ${d.get('pack')}`,
        `• Cantidad: ${d.get('cantidad')}`,
        `• Nombre: ${d.get('nombre') || '-'}`,
        `• Distrito: ${d.get('distrito') || '-'}`,
      ];
      if (d.get('nota')) lines.push(`• Nota: ${d.get('nota')}`);
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
    });
  }

  // Preseleccionar pack desde ?pack=
  const pack = new URLSearchParams(location.search).get('pack');
  const sel = document.querySelector('#pack');
  if (pack && sel) {
    const opt = [...sel.options].find((o) => o.dataset.key === pack);
    if (opt) sel.value = opt.value;
  }

  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
});
