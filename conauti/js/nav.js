/* Navegación con transición, guardas de paso y bloqueo anti doble clic */
(function () {
  const C = window.CONAUTI, { $, state } = C;
  let current = 1, busy = false;
  const leaveHooks = {}, enterHooks = {};
  const guards = { 2: s => C.valid1(s), 3: s => C.valid2(s), 4: s => C.valid2(s) };

  function goTo(n) {
    if (busy || n === current) return false;
    const g = guards[n];
    if (n > current && g && !g(state)) { C.toast('Completa los datos de este paso para continuar.', 'warn'); return false; }
    const out = $('#screen' + current), inn = $('#screen' + n);
    busy = true;
    if (leaveHooks[current]) C.safe(leaveHooks[current], 'leave')();
    out.classList.add('leave');
    setTimeout(() => {
      try {
        out.classList.add('hidden'); out.classList.remove('leave');
        inn.classList.remove('hidden');
        [...inn.children].forEach((el, i) => { el.classList.remove('enter'); void el.offsetWidth; el.classList.add('enter'); el.style.animationDelay = (i * 0.06) + 's'; });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        current = n;
        $('#stepLabel').textContent = `Paso ${n} de 5`;
        $('#barFill').style.width = (n * 20) + '%';
        $('#bar').setAttribute('aria-valuenow', n);
        if (enterHooks[n]) C.safe(enterHooks[n], 'enter')();
      } catch (e) { C.report(e, 'goTo'); }
      finally { busy = false; }
    }, 250);
    return true;
  }
  C.nav = { goTo, onLeave: (n, fn) => { leaveHooks[n] = fn; }, onEnter: (n, fn) => { enterHooks[n] = fn; }, get current() { return current; } };
})();
