const SFX = (() => {
  let c, mus, nb, muted = false, mode = null, timer = null, step = 0, next = 0;
  const ctx = () => {
    if (!c) {
      c = new (window.AudioContext || window.webkitAudioContext)();
      mus = c.createGain(); mus.gain.value = muted ? 0 : .5; mus.connect(c.destination);
      nb = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return c;
  };
  const tone = (f, d = .15, t = 'sine', v = .2, at = 0, slide, dest) => { try {
    const x = ctx(), o = x.createOscillator(), g = x.createGain(), s = x.currentTime + Math.max(0, at);
    o.type = t; o.frequency.setValueAtTime(f, s); if (slide) o.frequency.exponentialRampToValueAtTime(slide, s + d);
    g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(.001, s + d);
    o.connect(g).connect(dest || x.destination); o.start(s); o.stop(s + d + .02); } catch (e) {} };
  const noise = (d = .1, v = .2, at = 0, ft = 'bandpass', ff = 2000, dest) => { try {
    const x = ctx(), n = x.createBufferSource(), f = x.createBiquadFilter(), g = x.createGain(), s = x.currentTime + Math.max(0, at);
    n.buffer = nb; n.loop = true; f.type = ft; f.frequency.value = ff;
    g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(.001, s + d);
    n.connect(f).connect(g).connect(dest || x.destination); n.start(s); n.stop(s + d + .02); } catch (e) {} };
  const seq = (a, t, d, v) => a.forEach((f, i) => tone(f, d, t, v || .2, i * d * .8));

  // ---------- background music (step sequencer) ----------
  const SONG = {
    game:  { bpm: 150, roots: [110, 87.31, 130.81, 98],   chords: [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]] },  // Am F C G, tense
    intro: { bpm: 118, roots: [130.81, 110, 87.31, 98],   chords: [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]] }   // C Am F G, happy
  };
  const ARP = [0, 2, 1, 2, 0, 1, 2, 1, 2, 1, 0, 1, 2, 0, 1, 2];
  const play = (m, s, t) => {
    const P = SONG[m], bar = (s >> 4) & 3, i = s & 15, at = t - c.currentTime, ch = P.chords[bar];
    if (m === 'game') {
      if (i % 4 === 0) tone(160, .14, 'sine', .55, at, 40, mus);                 // kick
      if (i % 2 === 1) noise(.04, .1, at, 'highpass', 7000, mus);                // hi-hat
      if (i % 8 === 4) noise(.12, .22, at, 'bandpass', 1800, mus);               // snare
      if (i % 2 === 0) tone(P.roots[bar], .14, 'sawtooth', .13, at, 0, mus);     // driving bass
      tone(ch[ARP[i]] * (i > 7 ? 2 : 1), .1, 'square', .05, at, 0, mus);         // arpeggio
      if (bar === 3 && i === 14) tone(392, .2, 'sawtooth', .06, at, 784, mus);   // tension riser
    } else {
      if (i % 8 === 0) tone(150, .14, 'sine', .45, at, 45, mus);
      if (i % 8 === 4) noise(.1, .12, at, 'bandpass', 2200, mus);
      if (i % 2 === 1) noise(.03, .06, at, 'highpass', 8000, mus);
      if (i % 4 === 0) tone(P.roots[bar], .22, 'triangle', .22, at, 0, mus);
      tone(ch[ARP[i]] * 2, .12, 'triangle', .09, at, 0, mus);
      if (i % 4 === 2) tone(ch[ARP[i]] * 4, .1, 'sine', .04, at, 0, mus);
    }
  };
  const loop = () => { const dur = 60 / SONG[mode].bpm / 4; while (next < c.currentTime + .25) { play(mode, step, next); next += dur; step++; } };
  const stopM = () => { clearInterval(timer); timer = null; mode = null; };

  const FX = {
    unlock() { try { ctx().resume(); } catch (e) {} },
    music(m) { try {
      if (m === mode) return; stopM(); if (!m) return;
      ctx(); mode = m; step = 0; next = c.currentTime + .08; timer = setInterval(loop, 60); loop(); } catch (e) {} },
    mute(v) { muted = v; if (mus) mus.gain.value = v ? 0 : .5; return muted; },
    isMuted: () => muted,
    tick: () => tone(880, .06, 'square', .08),
    beep: () => tone(660, .14, 'square', .14),
    go: () => seq([523, 659, 784, 1047, 1319], 'triangle', .12),
    win: () => seq([523, 659, 784, 1047, 1319], 'triangle', .13),
    wrong: () => tone(220, .35, 'sawtooth', .2, 0, 80),
    freeze: () => FX.pw.freeze(),
    power: () => seq([660, 880, 1100], 'square', .08, .12),
    crate: () => seq([880, 1175, 880, 1175], 'triangle', .08, .14),
    grab: () => seq([523, 659, 784, 1047, 1568], 'square', .06, .12),
    hit: () => tone(300, .3, 'square', .2, 0, 60),
    splash: () => tone(140, .3, 'sawtooth', .2, 0, 40),
    shield: () => seq([392, 523, 784, 1047], 'sine', .12),
    // one sound per power-up
    pw: {
      freeze:   () => { seq([2349, 1976, 1568, 1319, 1047], 'sine', .1, .14); noise(.5, .12, 0, 'highpass', 6000); },
      ink:      () => { tone(200, .4, 'sawtooth', .2, 0, 45); noise(.35, .25, 0, 'lowpass', 600); },
      double:   () => seq([440, 494, 415, 466, 392, 440, 370], 'sawtooth', .09, .1),
      radar:    () => { tone(1200, .35, 'sine', .25); tone(1200, .35, 'sine', .1, .4); tone(1200, .35, 'sine', .05, .8); },
      scramble: () => { for (let i = 0; i < 10; i++) tone(300 + Math.random() * 900, .07, 'triangle', .12, i * .06); },
      shrink:   () => { tone(1600, .5, 'square', .1, 0, 120); tone(800, .5, 'sine', .1, .05, 90); },
      shield:   () => seq([392, 523, 784, 1047], 'sine', .12),
      flip:     () => { tone(250, .5, 'sine', .22, 0, 900); tone(900, .5, 'sine', .15, .45, 200); },
      mirror:   () => seq([1568, 1175, 1568, 1175, 1760], 'triangle', .09, .13),
      zoom:     () => { tone(180, .6, 'sawtooth', .12, 0, 1400); noise(.5, .12, 0, 'highpass', 3000); },
      eagle:    () => { tone(1800, .4, 'sawtooth', .1, 0, 2700); tone(2700, .35, 'sawtooth', .09, .4, 1300); },
      fog:      () => { noise(.8, .22, 0, 'lowpass', 500); tone(120, .8, 'sine', .15, 0, 70); },
      spin:     () => { for (let i = 0; i < 8; i++) tone(400 + i * 160, .09, 'triangle', .13, i * .07); },
      disco:    () => { seq([784, 988, 784, 1175, 988, 1319, 1175, 1568], 'square', .07, .1); noise(.1, .1, 0, 'highpass', 7000); },
      quake:    () => { tone(70, .7, 'sawtooth', .3, 0, 35); noise(.7, .3, 0, 'lowpass', 300); },
      ghost:    () => { tone(600, .7, 'sine', .15, 0, 300); tone(450, .7, 'sine', .1, .1, 220); },
      dark:     () => { tone(500, .6, 'triangle', .18, 0, 70); },
      bounce:   () => { for (let i = 0; i < 5; i++) tone(300 + (i % 2) * 250, .1, 'sine', .2, i * .11, 150); },
      drunk:    () => { tone(300, .9, 'sine', .18, 0, 500); tone(500, .9, 'sine', .15, .3, 260); },
      broom:    () => { noise(.5, .22, 0, 'bandpass', 1500); seq([660, 880, 1320], 'triangle', .07, .12); },
      crystal:  () => { seq([1568, 2093, 2637, 3136], 'sine', .14, .12); tone(3136, .7, 'sine', .06, .5); }
    },
    // game over: fanfare + applause + cheers, or sad trombone
    applause() { for (let i = 0; i < 160; i++) {
      const t = Math.random() * 5.5, env = Math.max(.15, Math.min(1, t / .8) * (t > 4 ? (5.5 - t) / 1.5 : 1));
      noise(.03 + Math.random() * .03, (.08 + Math.random() * .12) * env, t + .6, 'bandpass', 1200 + Math.random() * 3000); } },
    victory() {
      seq([523, 523, 523, 784, 659, 784, 1047], 'square', .16, .1);
      seq([262, 262, 262, 392, 330, 392, 523], 'triangle', .16, .18);
      tone(500, .6, 'sawtooth', .05, .9, 800); tone(620, .6, 'sawtooth', .04, 1.1, 990);
      FX.applause();
    },
    sad() {
      tone(311, .45, 'sawtooth', .18, 0, 293); tone(293, .45, 'sawtooth', .18, .5, 277);
      tone(277, .45, 'sawtooth', .18, .95, 261); tone(261, 1.1, 'sawtooth', .18, 1.4, 185);
    }
  };
  return FX;
})();
