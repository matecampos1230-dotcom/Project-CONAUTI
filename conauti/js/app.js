/* Arranque: cada pantalla se inicia por separado; si una falla, las demás siguen funcionando */
document.addEventListener('DOMContentLoaded', () => {
  const C = window.CONAUTI;
  try {
    if (typeof window.tailwind === 'undefined') C.toast('No pudimos cargar los estilos. Revisa tu conexión y recarga.', 'warn', 8000);
    const restored = C.loadDraft();
    ['s1', 's2', 's3', 's4', 's5'].forEach(k => {
      try { C.screens[k].init(); if (C.screens[k].restore) C.screens[k].restore(); }
      catch (e) { C.report(e, 'init ' + k); }
    });
    if (restored) C.toast('Recuperamos tu borrador. Puedes continuar donde lo dejaste.', 'info');
  } catch (e) { C.report(e, 'init'); }
});
