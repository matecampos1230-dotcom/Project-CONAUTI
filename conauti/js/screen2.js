/* Pantalla 2 · Recolección guiada (el ejemplo ya NO borra tus proyectos) */
(function () {
  const C = window.CONAUTI, { $, on, state, save, clean, CFG, toast } = C, L = CFG.LIMITS;
  const box = () => $('#projects');

  function addProject(data = {}) {
    if (box().children.length >= CFG.MAX_PROJECTS) return null;
    const node = $('#projectTpl').content.firstElementChild.cloneNode(true);
    const t = node.querySelector('[data-k=titulo]'), d = node.querySelector('[data-k=detalle]');
    t.maxLength = L.titulo; d.maxLength = L.detalle;
    t.value = data.titulo || ''; d.value = data.detalle || '';
    on(node.querySelector('.p-del'), 'click', () => {
      if (box().children.length === 1) return;
      node.style.transition = 'all .25s ease-out'; node.style.opacity = 0; node.style.transform = 'translateY(-6px)';
      setTimeout(() => { node.remove(); refresh(); }, 250);
    });
    on(node, 'input', refresh);
    box().appendChild(node);
    refresh();
    return node;
  }

  function refresh() {
    const cards = [...box().children];
    state.proyectos = cards.map((c, i) => {
      const titulo = clean(c.querySelector('[data-k=titulo]').value, L.titulo);
      const detalle = clean(c.querySelector('[data-k=detalle]').value, L.detalle, true);
      c.querySelector('.p-num').textContent = 'Proyecto ' + (i + 1);
      c.querySelector('.p-del').style.visibility = cards.length === 1 ? 'hidden' : 'visible';
      c.querySelector('.p-count').textContent = detalle.length >= CFG.MIN_DETAIL ? detalle.length + ' caracteres' : detalle.length + ' / ' + CFG.MIN_DETAIL + ' mín.';
      return { titulo, detalle };
    });
    $('#addProject').style.display = cards.length >= CFG.MAX_PROJECTS ? 'none' : 'block';
    state.formacion = { institucion: clean($('#institucion').value, L.institucion), carrera: clean($('#carrera').value, L.carrera), periodo: clean($('#periodo').value, L.periodo) };
    $('#next2').disabled = !C.valid2(state);
    save();
  }

  let ex = null, lastEx = -1, tipIdx = -1, tipTimer = null;
  const rnd = (len, last) => { if (len < 2) return 0; let i; do { i = Math.floor(Math.random() * len); } while (i === last); return i; };
  const fade = (els, fn) => {
    els.forEach(e => { e.style.opacity = 0; e.style.transform = 'translateY(4px)'; });
    setTimeout(() => { fn(); els.forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }); }, 220);
  };

  /* Ejemplos aleatorios (nunca repite el anterior seguido) */
  function pickExample(animate) {
    lastEx = rnd(C.EXAMPLES.length, lastEx); ex = C.EXAMPLES[lastEx];
    const set = () => { $('#exTitle').textContent = ex.titulo; $('#exBody').textContent = ex.detalle; };
    animate ? fade([$('#exTitle'), $('#exBody')], set) : set();
  }
  function toggleExample(show) {
    const p = $('#examplePanel'), open = typeof show === 'boolean' ? show : p.classList.contains('hidden');
    p.classList.toggle('hidden', !open);
    $('#example').setAttribute('aria-expanded', String(open));
    $('#example').textContent = open ? 'Ocultar ejemplo' : 'Ver un ejemplo';
    if (open) { pickExample(false); p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
  }
  function useExample() {
    const e = ex || C.EXAMPLES[0];
    const empty = box().children.length === 1 && !state.proyectos[0].titulo && !state.proyectos[0].detalle;
    if (empty) {
      const first = box().firstElementChild;
      first.querySelector('[data-k=titulo]').value = e.titulo;
      first.querySelector('[data-k=detalle]').value = e.detalle;
      refresh();
    } else if (!addProject(e)) {
      return toast('Ya tienes 3 proyectos. Quita uno para usar el ejemplo.', 'warn');
    }
    toggleExample(false);
    toast('Ejemplo añadido. Tus otros proyectos siguen intactos; edítalo con tus datos.', 'info');
  }

  /* Consejos dinámicos: cambian cada 15 s, con barra de progreso */
  function showTip(animate, force) {
    tipIdx = typeof force === 'number' ? force : rnd(C.TIPS.length, tipIdx);
    const p = $('#tipText'), bar = $('#tipBar');
    const set = () => { p.textContent = C.TIPS[tipIdx]; };
    animate ? fade([p], set) : set();
    bar.classList.remove('tip-bar'); void bar.offsetWidth;
    bar.style.animationDuration = CFG.TIP_MS + 'ms'; bar.classList.add('tip-bar');
  }
  function stopTips() { clearInterval(tipTimer); tipTimer = null; }
  function startTips() {
    stopTips(); showTip(false, 0);
    tipTimer = setInterval(C.safe(() => { if (!document.hidden) showTip(true); }, 'tips'), CFG.TIP_MS);
  }

  function init() {
    pickExample(false);
    [['institucion', L.institucion], ['carrera', L.carrera], ['periodo', L.periodo]].forEach(([id, max]) => { $('#' + id).maxLength = max; on($('#' + id), 'input', refresh); });
    on($('#addProject'), 'click', () => addProject());
    on($('#example'), 'click', () => toggleExample());
    on($('#closeExample'), 'click', () => toggleExample(false));
    on($('#useExample'), 'click', useExample);
    on($('#nextExample'), 'click', () => pickExample(true));
    C.nav.onEnter(2, startTips); C.nav.onLeave(2, stopTips);
    on($('#back2'), 'click', () => C.nav.goTo(1));
    on($('#next2'), 'click', () => { if (C.nav.goTo(3)) C.screens.s3.build(); });
  }
  function restore() {
    const f = state.formacion; $('#institucion').value = f.institucion; $('#carrera').value = f.carrera; $('#periodo').value = f.periodo;
    box().innerHTML = '';
    const saved = state.proyectos.length ? state.proyectos : [{}];
    saved.forEach(p => addProject(p));
  }
  C.screens.s2 = { init, restore };
})();
