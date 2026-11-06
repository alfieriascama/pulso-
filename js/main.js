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

  // Menú móvil (desplegable bajo la píldora)
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  if (nav && toggle) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Cerrar' : 'Menú';
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Franja superior: se puede cerrar y queda cerrada durante la visita
  const banner = document.querySelector('.banner');
  if (banner) {
    try { if (sessionStorage.getItem('beti-banner') === 'off') banner.hidden = true; } catch (e) { /* sin storage */ }
    banner.querySelector('.banner__close')?.addEventListener('click', () => {
      banner.hidden = true;
      try { sessionStorage.setItem('beti-banner', 'off'); } catch (e) { /* sin storage */ }
    });
  }

  // Pedido rápido (portada): pack elegido → WhatsApp
  const quick = document.querySelector('#quick-form');
  if (quick) {
    quick.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const pack = new FormData(quick).get('pack');
      window.open(waLink(`Hola, quiero información de PULSO+ — ${pack}`), '_blank', 'noopener');
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
