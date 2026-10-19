/* Pantalla 1 · Onboarding */
(function () {
  const C = window.CONAUTI, { $, $$, on, state, save, clean, CFG } = C;
  function read() {
    state.puesto = clean($('#puesto').value, CFG.LIMITS.puesto);
    $('#next1').disabled = !C.valid1(state);
  }
  function init() {
    $('#puesto').maxLength = CFG.LIMITS.puesto;
    $$('input[name="situacion"]').forEach(r => on(r, 'change', e => { if (C.SIT[e.target.value]) { state.situacion = e.target.value; read(); save(); } }));
    on($('#puesto'), 'input', () => { read(); save(); });
    on($('#next1'), 'click', () => C.nav.goTo(2));
  }
  function restore() {
    const r = state.situacion && document.querySelector(`input[name="situacion"][value="${state.situacion}"]`);
    if (r) r.checked = true;
    $('#puesto').value = state.puesto; read();
  }
  C.screens.s1 = { init, restore };
})();
