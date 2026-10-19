/* Pantalla 4 · Simulador de entrevista por bloques (3 preguntas + opción de más) */
(function () {
  const C = window.CONAUTI, { $, on, state, clean, words, fmt, CFG, toast } = C;
  let order = [], idx = 0, total = 0, left = CFG.INTERVIEW_SECONDS, tick = null, recog = null, listening = false;

  const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const remaining = () => order.length - total;
  const extra = () => Math.min(CFG.MORE_BLOCK, remaining());

  function setMic(on_) {
    listening = on_;
    $('#micDot').className = 'w-2.5 h-2.5 rounded-full transition-colors duration-300 ' + (on_ ? 'bg-red-500 animate-pulse' : 'bg-gray-400');
    $('#micLabel').textContent = on_ ? 'Escuchando… toca para detener' : 'Responder con voz';
  }
  function stop() {
    clearInterval(tick); tick = null;
    try { recog && recog.stop(); } catch (_) {}
    setMic(false);
  }
  function view(mode) {
    $('#qArea').classList.toggle('hidden', mode !== 'q');
    $('#morePanel').classList.toggle('hidden', mode !== 'more');
    $('#timerBox').classList.toggle('invisible', mode !== 'q');
    const el = mode === 'q' ? $('#qArea') : $('#morePanel');
    el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter');
  }
  function dots() {
    $('#qCount').textContent = `Pregunta ${idx + 1} de ${total}`;
    $('#qDots').innerHTML = Array.from({ length: total }, (_, i) =>
      `<span class="h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-[#1D1D1F]' : i < idx ? 'w-1.5 bg-[#1D1D1F]/60' : 'w-1.5 bg-black/15'}"></span>`).join('');
  }

  function showQuestion() {
    stop(); view('q'); dots();
    const [tag, q] = order[idx];
    $('#qTag').textContent = tag;
    $('#qText').textContent = `Para el puesto de ${state.puesto}: ${q}`;
    $('#answer').value = ''; $('#answer').maxLength = CFG.LIMITS.respuesta;
    $('#wc').textContent = '0 palabras'; $('#next4').disabled = true;
    $('#next4').textContent = idx + 1 < total ? 'Siguiente pregunta' : 'Enviar última respuesta';
    left = CFG.INTERVIEW_SECONDS; $('#timer').textContent = fmt(left); $('#timer').classList.remove('text-red-600');
    tick = setInterval(C.safe(() => {
      left--; $('#timer').textContent = fmt(Math.max(left, 0));
      $('#timer').classList.toggle('text-red-600', left <= 15);
      if (left <= 0) submit(true);
    }, 'timer'), 1000);
  }

  /* Nueva ronda completa: la primera pregunta es fija y el resto se mezcla */
  function start() {
    order = [C.QS[0], ...shuffle(C.QS.slice(1))];
    idx = 0; total = Math.min(CFG.FIRST_BLOCK, order.length); state.respuestas = [];
    showQuestion();
  }
  /* Añade otro bloque de preguntas a la práctica en curso */
  function more() {
    if (remaining() <= 0) { toast('Ya practicaste todas las preguntas. Empezamos una ronda nueva.', 'info'); return start(); }
    total += extra(); idx = state.respuestas.length; showQuestion();
  }

  function submit(auto) {
    const t = clean($('#answer').value, CFG.LIMITS.respuesta, true), w = words(t);
    if (!auto && w < CFG.MIN_ANSWER_WORDS) return toast(`Escribe al menos ${CFG.MIN_ANSWER_WORDS} palabras.`, 'warn');
    const used = CFG.INTERVIEW_SECONDS - Math.max(left, 0);
    stop();
    if (w < CFG.MIN_ANSWER_WORDS) { toast('Se acabó el tiempo sin una respuesta. Inténtalo de nuevo con la misma pregunta.', 'warn'); return showQuestion(); }
    const [tag, q] = order[idx];
    state.respuestas.push({ tag, pregunta: q, texto: t, segundos: used });
    if (idx + 1 < total) { idx++; showQuestion(); }
    else if (remaining() > 0) askMore();
    else finishAll();
  }
  function askMore() {
    view('more');
    $('#moreCount').textContent = `Completaste ${total} preguntas · quedan ${remaining()} disponibles`;
    $('#moreYes').textContent = `Sí, practicar ${extra()} más`;
  }
  function finishAll() {
    stop();
    if (C.nav.goTo(5)) C.screens.s5.render();
  }

  function toggleMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (listening) { try { recog && recog.stop(); } catch (_) {} return setMic(false); }
    if (!SR) return toast('Tu navegador no admite dictado por voz. Escribe tu respuesta o usa Chrome.', 'warn');
    recog = new SR(); recog.lang = 'es-PE'; recog.continuous = true; recog.interimResults = false;
    recog.onresult = C.safe(e => { for (let i = e.resultIndex; i < e.results.length; i++) $('#answer').value += e.results[i][0].transcript + ' '; $('#answer').dispatchEvent(new Event('input')); }, 'voz');
    recog.onerror = e => { setMic(false); toast(e.error === 'not-allowed' ? 'Permite el acceso al micrófono para dictar.' : 'No pudimos usar el micrófono. Escribe tu respuesta.', 'warn'); };
    recog.onend = () => setMic(false);
    recog.start(); setMic(true);
  }

  function init() {
    on($('#answer'), 'input', () => {
      const w = words($('#answer').value);
      $('#wc').textContent = w + (w === 1 ? ' palabra' : ' palabras');
      $('#next4').disabled = w < CFG.MIN_ANSWER_WORDS;
    });
    on($('#mic'), 'click', toggleMic);
    on($('#next4'), 'click', () => submit(false));
    on($('#moreYes'), 'click', () => { total += extra(); idx = state.respuestas.length; showQuestion(); });
    on($('#moreNo'), 'click', finishAll);
    on($('#back4'), 'click', () => {
      if (state.respuestas.length && !confirm('Si vuelves al CV perderás las respuestas de esta práctica. ¿Continuar?')) return;
      C.nav.goTo(3);
    });
    C.nav.onLeave(4, stop);
  }
  C.screens.s4 = { init, start, more };
})();
