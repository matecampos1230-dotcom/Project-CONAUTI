/* Pantalla 3 · Vista previa del CV */
(function () {
  const C = window.CONAUTI, { $, on, state, esc } = C;
  const bullets = t => t.split(/[.;\n]+/).map(s => s.trim()).filter(s => s.length > 8).map(s => s.charAt(0).toUpperCase() + s.slice(1));

  function build() {
    const f = state.formacion, ps = C.goodProjects(state);
    if (!ps.length) return;
    $('#cvRole').textContent = 'Postulando a: ' + state.puesto;
    $('#cvSummary').textContent = `${C.SIT[state.situacion]} de ${f.carrera} en ${f.institucion}, con experiencia práctica en ${ps.map(p => p.titulo.toLowerCase()).slice(0, 2).join(' y ')}. Busca aportar como ${state.puesto}.`;
    $('#cvEdu').innerHTML = `<strong class="font-medium">${esc(f.carrera)}</strong><br><span class="text-[#86868B]">${esc(f.institucion)}${f.periodo ? ' · ' + esc(f.periodo) : ''}</span>`;
    $('#cvProjects').innerHTML = ps.map(p => `<div class="enter"><p class="font-medium">${esc(p.titulo)}</p><ul class="mt-1.5 grid gap-1.5 text-[15px] list-disc pl-5 marker:text-[#86868B]">${bullets(p.detalle).map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>`).join('');
  }
  function init() {
    on($('#cvName'), 'keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    on($('#cvName'), 'input', e => { if (e.target.textContent.length > 60) e.target.textContent = e.target.textContent.slice(0, 60); });
    on($('#back3'), 'click', () => C.nav.goTo(2));
    on($('#pdf'), 'click', () => { if (typeof window.print === 'function') window.print(); else C.toast('Tu navegador no permite imprimir desde aquí.', 'warn'); });
    on($('#next3'), 'click', () => { if (C.nav.goTo(4)) C.screens.s4.start(); });
  }
  C.screens.s3 = { init, build };
})();
