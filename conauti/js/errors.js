/* Sistema antierrores: captura global, avisos amables, wrappers seguros y almacenamiento a prueba de fallos */
(function () {
  const C = (window.CONAUTI = window.CONAUTI || {});

  function toast(msg, type = 'info', ms = 4500) {
    try {
      const box = document.getElementById('toasts');
      if (!box) return console.warn(msg);
      const tone = { info: '', warn: 'ring-1 ring-amber-300/80', error: 'ring-1 ring-red-300/80' }[type] || '';
      const el = document.createElement('div');
      el.setAttribute('role', type === 'error' ? 'alert' : 'status');
      el.className = `enter pointer-events-auto glass ${tone} rounded-xl px-4 py-3 text-sm max-w-sm`;
      el.textContent = msg;
      box.appendChild(el);
      while (box.children.length > 3) box.firstChild.remove();
      setTimeout(() => { el.style.transition = 'all .25s'; el.style.opacity = 0; setTimeout(() => el.remove(), 250); }, ms);
    } catch (_) { /* nunca romper por un aviso */ }
  }

  let lastAt = 0;
  function report(err, label) {
    console.error('[CONAUTI]', label || '', err);
    const now = Date.now();
    if (now - lastAt < 3000) return; // evita avisos repetidos
    lastAt = now;
    toast('Algo no salió como esperábamos. Tus datos están a salvo, intenta de nuevo.', 'error');
  }

  /* Envuelve una función: si falla, avisa y la app sigue funcionando */
  function safe(fn, label) {
    return function (...args) {
      try {
        const r = fn.apply(this, args);
        if (r && typeof r.catch === 'function') r.catch(e => report(e, label));
        return r;
      } catch (e) { report(e, label); }
    };
  }
  function on(el, evt, fn, label) {
    if (!el) return console.warn('on(): elemento inexistente', label || evt);
    el.addEventListener(evt, safe(fn, label || evt));
  }

  window.addEventListener('error', e => report(e.error || e.message, 'window.error'));
  window.addEventListener('unhandledrejection', e => { report(e.reason, 'promise'); e.preventDefault(); });
  window.addEventListener('offline', () => toast('Sin conexión. Guardamos tu avance en este dispositivo.', 'warn'));
  window.addEventListener('online', () => toast('Conexión restablecida.', 'info', 2500));

  /* Almacenamiento: localStorage con respaldo en memoria si está bloqueado */
  const mem = {}; let ls = null;
  try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); ls = localStorage; } catch (_) {}
  const Store = {
    get(k) { try { const v = ls ? ls.getItem(k) : mem[k]; return v ? JSON.parse(v) : null; } catch (_) { return null; } },
    set(k, v) { try { const s = JSON.stringify(v); ls ? ls.setItem(k, s) : (mem[k] = s); } catch (_) {} },
    remove(k) { try { ls ? ls.removeItem(k) : delete mem[k]; } catch (_) {} }
  };

  Object.assign(C, { toast, report, safe, on, Store });
})();
