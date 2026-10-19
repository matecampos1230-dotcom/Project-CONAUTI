/* Pantalla 5 · Feedback de toda la práctica */
(function () {
  const C = window.CONAUTI, { $, on, state, esc, fmt, CFG, Store } = C;
  let counter = null;
  const li = x => `<li class="flex gap-2.5"><span class="mt-2 w-1 h-1 rounded-full bg-[#1D1D1F] shrink-0"></span><span>${x}</span></li>`;

  function render() {
    const rs = state.respuestas;
    if (!rs.length) return C.toast('Aún no hay respuestas para evaluar.', 'warn');
    const an = rs.map(r => C.analyze(r.texto));
    const score = Math.round(an.reduce((s, a) => s + a.score, 0) / an.length);
    const secs = rs.reduce((s, r) => s + r.segundos, 0);

    const str = [], imp = [];
    C.CRITERIA.forEach(c => {
      const ratio = an.filter(a => a.flags[c.key]).length / an.length;
      (ratio >= 0.5 ? str : imp).push(ratio >= 0.5 ? c.pass : c.fail);
    });
    if (!str.length) str.push(`Respondiste ${rs.length} preguntas completas, y practicar es el primer paso.`);
    if (!imp.length) imp.push('Mantén este nivel: practica con preguntas nuevas para ganar naturalidad.');

    $('#fQs').innerHTML = rs.map((r, i) => `<li>
      <div class="flex items-baseline justify-between gap-3"><span class="font-medium">${i + 1}. ${esc(r.tag)}</span><span class="tabular-nums text-sm font-semibold">${an[i].score}</span></div>
      <p class="mt-0.5 text-sm text-[#86868B]">${esc(r.pregunta)}</p>
      <div class="mt-2 h-1 rounded-full bg-black/5 overflow-hidden"><div class="h-full rounded-full bg-[#1D1D1F] transition-all duration-1000 ease-out" style="width:0" data-w="${an[i].score}"></div></div></li>`).join('');
    $('#fStr').innerHTML = str.map(li).join('');
    $('#fImp').innerHTML = imp.map(li).join('');
    $('#fTips').innerHTML = [
      'Habla despacio y haz pausas breves antes de las ideas clave.',
      'Estructura cada respuesta: situación, tarea, acción y resultado.',
      rs.length < 5 ? 'Con 5 o más preguntas llegas con más confianza a la entrevista real: te recomendamos otra ronda.' : `Ya practicaste ${rs.length} preguntas: repite las que te costaron para ganar naturalidad.`
    ].map(li).join('');
    $('#verdict').textContent = score >= 80 ? 'Muy buen desempeño.' : score >= 65 ? 'Buen avance.' : 'Tienes una base para mejorar.';
    $('#verdictSub').textContent = `Respondiste ${rs.length} ${rs.length === 1 ? 'pregunta' : 'preguntas'} · Tiempo total ${fmt(secs)}`;

    clearInterval(counter);
    $('#score').textContent = '0'; $('#ring').style.strokeDashoffset = 326.7;
    setTimeout(() => {
      $('#ring').style.strokeDashoffset = 326.7 * (1 - score / 100);
      document.querySelectorAll('#fQs [data-w]').forEach(b => { b.style.width = b.dataset.w + '%'; });
      let n = 0; counter = setInterval(() => { n = Math.min(n + 2, score); $('#score').textContent = n; if (n >= score) clearInterval(counter); }, 20);
    }, 400);
  }
  function init() {
    on($('#again'), 'click', () => { if (C.nav.goTo(4)) C.screens.s4.more(); });
    on($('#restart'), 'click', () => { Store.remove(CFG.DRAFT_KEY); location.reload(); });
    C.nav.onLeave(5, () => clearInterval(counter));
  }
  C.screens.s5 = { init, render };
})();
