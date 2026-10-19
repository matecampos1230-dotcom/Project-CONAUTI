/* Análisis de respuestas (heurística local). Aquí se podría conectar un modelo de IA. */
(function () {
  const C = window.CONAUTI;
  C.CRITERIA = [
    { key: 'detail', pass: 'Desarrollaste tus respuestas con suficiente detalle.', fail: 'Amplía tus respuestas: apunta a unas 60 a 90 palabras cada una.' },
    { key: 'action', pass: 'Describiste acciones concretas que hiciste tú.', fail: 'Usa verbos en primera persona: “diseñé”, “coordiné”, “propuse”.' },
    { key: 'result', pass: 'Respaldaste tu aporte con resultados o datos.', fail: 'Cierra con un resultado, idealmente con un número.' },
    { key: 'context', pass: 'Diste contexto: dónde ocurrió y cuál era tu rol.', fail: 'Abre con el contexto: dónde ocurrió y cuál era tu responsabilidad.' }
  ];
  C.analyze = function (t) {
    const w = C.words(t);
    const S = /cuando|durante|en (mi|el|un) (curso|proyecto|equipo)|estudio|universidad/i.test(t);
    const T = /objetivo|tarea|deb[ií]a|ten[ií]amos|mi rol|responsable/i.test(t);
    const A = /decid[ií]|organic[eé]|propuse|desarroll[eé]|dise[ñn][eé]|lider[eé]|implement[eé]|coordin[eé]|cre[eé]|habl[eé]|constru[ií]|aprend[ií]|resolv[ií]/i.test(t);
    const R = /logr|resultado|finalmente|mejor[oó]|ahorr|aprob|\d+ ?%|gracias a/i.test(t);
    const nums = /\d/.test(t);
    const flags = { detail: w >= 50, action: A, result: R || nums, context: S || T };
    const hits = [S, T, A, R].filter(Boolean).length;
    const score = Math.min(95, Math.round(40 + Math.min(w, 90) / 90 * 25 + (nums ? 10 : 0) + hits * 5));
    return { score, flags, words: w };
  };
})();
