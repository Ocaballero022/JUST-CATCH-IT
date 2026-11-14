// Visual effects shared by host + phones: countdown, confetti, crying losers.
const FX = {
  // avatar: photo (with the animal as a small badge) or a dancing animal emoji
  av(p) {
    const d = -((Date.now() / 1000) % 1.6).toFixed(2);   // keeps the dance smooth when the screen re-renders
    return p.photo
      ? `<span class="ph" style="animation-delay:${d}s"><img src="${p.photo}" alt=""><b>${p.avatar}</b></span>`
      : `<span class="mv" style="animation-delay:${d}s">${p.avatar}</span>`;
  },
  countdown(el) {
    const seq = ['3', '2', '1', 'GO!'];
    el.classList.remove('hide');
    seq.forEach((t, i) => setTimeout(() => {
      el.textContent = t; el.style.color = t === 'GO!' ? 'var(--mint)' : 'var(--sun)';
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      t === 'GO!' ? SFX.go() : SFX.beep();
      if (i === 3) setTimeout(() => el.classList.add('hide'), 800);
    }, i * 1000));
  },
  clear() { document.getElementById('fxl').innerHTML = ''; document.getElementById('sadl').innerHTML = ''; },
  over(losers, party) {
    FX.clear();
    document.getElementById('sadl').innerHTML = (losers || []).map(l =>
      `<div class="loser"><span class="f">${FX.av(l)}</span><span class="x">😭</span><i class="tear">💧</i><i class="tear t2">💧</i><small>${l.name}</small></div>`).join('');
    if (!party) return;
    const E = ['🎉', '🎊', '✨', '⭐', '🏆', '🎈'], box = document.getElementById('fxl');
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('span'); s.className = 'conf'; s.textContent = E[Math.random() * E.length | 0];
      s.style.cssText = `left:${Math.random() * 100}vw;animation-duration:${3 + Math.random() * 4}s;animation-delay:${Math.random() * 3}s;font-size:${1.2 + Math.random() * 2}rem`;
      box.appendChild(s);
    }
  }
};
