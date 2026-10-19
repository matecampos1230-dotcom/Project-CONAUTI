/* Utilidades: selectores seguros, saneamiento y formato */
(function () {
  const C = window.CONAUTI;
  C.$ = (s, r = document) => { const el = r.querySelector(s); if (!el) throw new Error('Falta el elemento ' + s); return el; };
  C.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  C.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  C.fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  C.words = t => (t || '').trim().split(/\s+/).filter(Boolean).length;
  /* Limpia texto: recorta, limita largo y (opcional) conserva saltos de línea */
  C.clean = (v, max, multiline) => {
    let s = String(v == null ? '' : v);
    s = multiline ? s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n') : s.replace(/\s+/g, ' ');
    return s.trim().slice(0, max);
  };
})();
