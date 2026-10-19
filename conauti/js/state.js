/* Estado central, validaciones y guardado de borrador */
(function () {
  const C = window.CONAUTI, { CFG, Store } = C;
  const state = { situacion: '', puesto: '', formacion: { institucion: '', carrera: '', periodo: '' }, proyectos: [], respuestas: [] };

  const valid1 = s => !!(C.SIT[s.situacion] && s.puesto.length >= 3);
  const goodProjects = s => s.proyectos.filter(p => p.titulo && p.detalle.length >= CFG.MIN_DETAIL);
  const valid2 = s => valid1(s) && !!s.formacion.institucion && !!s.formacion.carrera && goodProjects(s).length > 0;

  function save() {
    Store.set(CFG.DRAFT_KEY, { situacion: state.situacion, puesto: state.puesto, formacion: state.formacion, proyectos: state.proyectos });
    /* TODO Firebase: setDoc(doc(db,'perfiles',auth.currentUser.uid), state, { merge: true }) */
  }
  /* Restaura un borrador validando cada campo (nunca confía en lo guardado) */
  function loadDraft() {
    const d = Store.get(CFG.DRAFT_KEY), L = CFG.LIMITS;
    if (!d || typeof d !== 'object') return false;
    if (C.SIT[d.situacion]) state.situacion = d.situacion;
    state.puesto = C.clean(d.puesto, L.puesto);
    const f = d.formacion || {};
    state.formacion = { institucion: C.clean(f.institucion, L.institucion), carrera: C.clean(f.carrera, L.carrera), periodo: C.clean(f.periodo, L.periodo) };
    state.proyectos = (Array.isArray(d.proyectos) ? d.proyectos : []).slice(0, CFG.MAX_PROJECTS)
      .map(p => ({ titulo: C.clean(p && p.titulo, L.titulo), detalle: C.clean(p && p.detalle, L.detalle, true) }));
    return !!(state.situacion || state.puesto || state.proyectos.some(p => p.titulo || p.detalle));
  }
  Object.assign(C, { state, valid1, valid2, goodProjects, save, loadDraft });
})();
