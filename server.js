const express = require('express'), http = require('http'), os = require('os'), path = require('path'), QR = require('qrcode');
const { Server } = require('socket.io');
const ANIMALS = require('./animals'), EXTRA = require('./clues');
const AN_ES = require('./animals_es'), EXTRA_ES = require('./clues_es');   // Spanish names + clues

const app = express(), srv = http.createServer(app), io = new Server(srv, { pingInterval: 20000, pingTimeout: 60000 });
process.on('uncaughtException', e => console.error('Error (server keeps running):', e));
process.on('unhandledRejection', e => console.error('Error (server keeps running):', e));
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
app.get('/host', (q, r) => r.sendFile(path.join(__dirname, 'public', 'host.html')));
const lan = () => { for (const l of Object.values(os.networkInterfaces())) for (const i of l) if (i.family === 'IPv4' && !i.internal) return i.address; return 'localhost'; };
// player photos live only in memory (never saved to disk) and are served per room
app.get('/photo/:code/:id', (q, r) => {
  const room = rooms[q.params.code], p = room && room.players.get(q.params.id);
  if (!p || !p.photo) return r.sendStatus(404);
  r.set({ 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' });
  r.send(Buffer.from(p.photo.split(',')[1], 'base64'));
});
app.get('/api/lan', (q, r) => r.json({ ip: lan(), port: PORT }));

// CLUE_MS: time to read the clue. No timer in the grid phase: the round ends when someone finds the animal.
const CLUE_MS = 5000, FREEZE_MS = 3000, PICK_MS = 10000, GRID_SIZE = 96, COUNT_MS = 4000, CRATE_DELAY = 8000, CRATE_LIFE = 12000, HOST_GRACE_MS = 10000;
const POWERS = {
  freeze:   { name: 'Ice Freeze',    icon: '🧊' },
  ink:      { name: 'Ink Splash',    icon: '🦑' },
  double:   { name: 'Double Vision', icon: '😵‍💫' },
  radar:    { name: 'Radar Hint',    icon: '📡' },
  scramble: { name: 'Soup Scramble', icon: '🥣' },
  shrink:   { name: 'Shrink Ray',    icon: '🔬' },
  flip:     { name: 'Upside Down',   icon: '🙃' },
  mirror:   { name: 'Mirror Madness',icon: '🪞' },
  zoom:     { name: 'Zoom Trap',     icon: '🔍' },
  eagle:    { name: 'Eagle Eye',     icon: '🦅' },
  fog:      { name: 'Fog Bomb',      icon: '🌫️' },
  spin:     { name: 'Crazy Spin',    icon: '🌀' },
  disco:    { name: 'Disco Fever',   icon: '🪩' },
  quake:    { name: 'Earthquake',    icon: '🌋' },
  ghost:    { name: 'Ghost Mode',    icon: '👻' },
  dark:     { name: 'Lights Out',    icon: '🌑' },
  bounce:   { name: 'Bouncy Ball',   icon: '🏀' },
  drunk:    { name: 'Dizzy Dance',   icon: '🥴' },
  broom:    { name: 'Magic Broom',   icon: '🧹' },
  crystal:  { name: 'Crystal Ball',  icon: '🔮' }
};
// attack powers that only add a visual effect on the rivals' phones (duration in ms)
const FX_MS = { ink: 3000, double: 4000, shrink: 4000, flip: 5000, mirror: 5000, zoom: 4000,
  fog: 4000, spin: 4000, disco: 4000, quake: 3000, ghost: 4000, dark: 3000, bounce: 4000, drunk: 5000 };
const KEYS = Object.keys(POWERS);
const rooms = {};
const rid = () => Math.random().toString(36).slice(2, 10);
const shuffle = a => { a = [...a]; for (let i = a.length; i > 1;) { const j = Math.random() * i-- | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const newCode = () => { let c; do c = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random() * 24 | 0]).join(''); while (rooms[c]); return c; };
const alive = r => [...r.players.values()].filter(p => p.lives > 0);
const phu = (r, p) => p.photo ? `/photo/${r.code}/${p.id}` : null;
const pub = r => ({ phase: r.phase, max: r.max, round: r.round, lang: r.lang,
  players: [...r.players.values()].map(p => ({ id: p.id, name: p.name, avatar: p.avatar, lives: p.lives, alive: p.lives > 0, shield: p.shield, online: p.online, power: !!p.power, photo: phu(r, p) })) });
const sync = r => io.to(r.code).emit('state', pub(r));
// feed messages are sent as a key + params; every screen translates them into its own language
const say = (r, k, a, sfx) => io.to(r.code).emit('feed', { k, a, sfx });
const clearT = r => {
  clearTimeout(r.t1); clearTimeout(r.t2); clearInterval(r.t3); clearTimeout(r.t4);
  if (r.crate) { r.crate = null; io.to(r.code).emit('crate', null); }
};

function startCount(r) {
  clearT(r); r.phase = 'count';
  io.to(r.code).emit('count', { ms: COUNT_MS });
  sync(r);
  r.t1 = setTimeout(() => startRound(r), COUNT_MS);
}
function startRound(r) {
  clearT(r); r.round++; r.phase = 'clue';
  if (r.used.size >= ANIMALS.length) r.used.clear();
  let a; do a = ANIMALS[Math.random() * ANIMALS.length | 0]; while (r.used.has(a[0]));
  r.used.add(a[0]); r.target = a[0];
  const es = AN_ES[a[1]] || [];
  r.aname = { en: a[1], es: es[0] || a[1] };
  const pool = r.lang === 'es' ? [...(EXTRA_ES[a[1]] || []), es[1]].filter(Boolean) : [...(EXTRA[a[1]] || []), a[2]];
  r.clue = pool[Math.random() * pool.length | 0];
  const others = shuffle(ANIMALS.map(x => x[0]).filter(e => e !== r.target));
  let decoys = []; while (decoys.length < GRID_SIZE - 1) decoys = decoys.concat(shuffle(others));
  r.grid = shuffle([r.target, ...decoys.slice(0, GRID_SIZE - 1)]);
  for (const p of r.players.values()) p.frozenUntil = 0;
  r.clueEnd = Date.now() + CLUE_MS;
  io.to(r.code).emit('clue', { round: r.round, clue: r.clue, ms: CLUE_MS });
  sync(r);
  r.t1 = setTimeout(() => startGrid(r), CLUE_MS);
}
function startGrid(r) {
  r.phase = 'grid';
  io.to(r.code).emit('grid', { grid: r.grid, clue: r.clue });
  sync(r);
  scheduleCrate(r);   // first crate 8 s after the grid appears
}
// next crate comes CRATE_DELAY after the previous power was used (or the crate expired)
function scheduleCrate(r) { clearTimeout(r.t3); r.t3 = setTimeout(() => spawnCrate(r), CRATE_DELAY); }
function spawnCrate(r) {
  if (r.phase !== 'grid' || r.crate) return;
  if (!alive(r).some(p => !p.power)) return scheduleCrate(r);
  r.recent = r.recent || [];
  const fresh = KEYS.filter(k => !r.recent.includes(k)), key = fresh[Math.random() * fresh.length | 0];
  r.recent.push(key); if (r.recent.length > 8) r.recent.shift();
  r.crate = { id: rid(), key };
  io.to(r.code).emit('crate', { id: r.crate.id });
  say(r, 'crate', {}, 'crate');
  r.t4 = setTimeout(() => { r.crate = null; io.to(r.code).emit('crate', null); scheduleCrate(r); }, CRATE_LIFE);
}
function usePower(r, p) {
  if (r.phase !== 'grid' || !p.power || p.lives <= 0) return;
  const k = p.power; p.power = null;
  const others = alive(r).filter(o => o !== p), to = (ev, d) => others.forEach(o => io.to(o.sid).emit(ev, d));
  if (k === 'freeze') { others.forEach(o => o.frozenUntil = Date.now() + 3000); to('frozen', { ms: 3000 }); }
  else if (FX_MS[k]) to('fx', { type: k, ms: FX_MS[k] });
  else if (k === 'broom') io.to(p.sid).emit('trim', shuffle(r.grid.map((e, i) => i).filter(i => r.grid[i] && r.grid[i] !== r.target)).slice(0, 30));
  else if (k === 'crystal') io.to(p.sid).emit('radar', shuffle([r.target, ...shuffle([...new Set(r.grid.filter(e => e && e !== r.target))]).slice(0, 1)]));
  else if (k === 'radar') io.to(p.sid).emit('radar', shuffle([r.target, ...shuffle([...new Set(r.grid.filter(e => e && e !== r.target))]).slice(0, 4)]));
  else if (k === 'scramble') { r.grid = shuffle(r.grid); io.to(r.code).emit('scramble', { grid: r.grid, clue: r.clue }); }
  else if (k === 'eagle') io.to(p.sid).emit('trim', shuffle(r.grid.map((e, i) => i).filter(i => r.grid[i] !== r.target)).slice(0, 55));
  io.to(p.sid).emit('power', null);
  scheduleCrate(r);
  io.to(r.code).emit('powerUsed', { key: k });
  say(r, 'used', { av: p.avatar, n: p.name, i: POWERS[k].icon, k });
  sync(r);
}
function win(r, p) {
  clearT(r); r.phase = 'target'; r.winner = p.id;
  const opts = alive(r).filter(o => o !== p).map(o => ({ id: o.id, name: o.name, avatar: o.avatar, lives: o.lives, shield: o.shield }));
  io.to(r.code).emit('won', { id: p.id, name: p.name, avatar: p.avatar, emoji: r.target, animal: r.aname });
  io.to(p.sid).emit('choose', { opts, ms: PICK_MS });
  r.t1 = setTimeout(() => hit(r, opts[Math.random() * opts.length | 0].id), PICK_MS);
  sync(r);
}
function hit(r, id) {
  const t = r.players.get(id); if (!t || t.lives <= 0 || r.phase !== 'target') return;
  clearTimeout(r.t1); r.phase = 'result';
  const blocked = false; t.lives--;
  io.to(r.code).emit('hit', { id: t.id, name: t.name, avatar: t.avatar, blocked, lives: t.lives, out: t.lives <= 0 });
  sync(r);
  const al = alive(r);
  if (al.length <= 1) {
    r.phase = 'over';
    r.t1 = setTimeout(() => {
      const w = al[0];
      const losers = [...r.players.values()].filter(p => !w || p.id !== w.id).map(p => ({ avatar: p.avatar, name: p.name, photo: phu(r, p) }));
      io.to(r.code).emit('over', w ? { id: w.id, name: w.name, avatar: w.avatar, photo: phu(r, w), losers } : { losers });
      sync(r);
    }, 2800);
  } else r.t1 = setTimeout(() => startRound(r), 4000);
}

io.on('connection', socket => {
  const S = {};
  const room = () => rooms[S.code || S.host], me = () => { const r = room(); return r && r.players.get(S.pid); };

  socket.on('host:create', (arg, ack) => {
    const origin = typeof arg === 'string' ? arg : arg.origin, lang = arg && arg.lang === 'es' ? 'es' : 'en';
    const c = newCode(), r = rooms[c] = { code: c, lang, max: 8, players: new Map(), phase: 'lobby', round: 0, used: new Set(), crate: null };
    S.host = c; socket.join(c); r.hostSid = socket.id;
    const url = `${origin}/?room=${c}`;
    QR.toDataURL(url, { margin: 1, width: 360 }).then(qr => ack({ code: c, url, qr }));
  });
  // The host screen can reconnect (sleep, Wi-Fi blip, background tab) without losing the game
  socket.on('host:resume', ({ code, origin }, ack) => {
    const r = rooms[code]; if (!r) return ack({ ok: 0 });
    clearTimeout(r.hostOff); r.hostSid = socket.id; S.host = code; socket.join(code);
    const url = `${origin}/?room=${code}`;
    QR.toDataURL(url, { margin: 1, width: 360 }).then(qr => {
      ack({ ok: 1, code, url, qr });
      sync(r);
      if (r.phase === 'clue') socket.emit('clue', { round: r.round, clue: r.clue, ms: Math.max(0, r.clueEnd - Date.now()) });
      if (r.phase === 'grid') socket.emit('grid', { grid: r.grid, clue: r.clue });
    });
  });
  // the host picks the game language (clues + animal names); phones keep their own interface language
  socket.on('host:lang', l => { const r = rooms[S.host]; if (r && (l === 'en' || l === 'es') && r.lang !== l) { r.lang = l; sync(r); } });
  socket.on('host:alive', (code, ack) => ack(!!rooms[code]));   // lets the host page detect a lost room
  // The host closes the room (from the game-over screen) to open a fresh one with a new code
  socket.on('host:close', ack => {
    const r = rooms[S.host];
    if (r) {
      clearT(r); clearTimeout(r.hostOff);
      io.to(r.code).emit('closed');      // tells every phone the room is gone
      delete rooms[r.code];
      socket.leave(r.code);
      S.host = null;
    }
    if (typeof ack === 'function') ack();
  });
  socket.on('host:max', n => { const r = rooms[S.host]; if (r && r.phase === 'lobby' && n >= Math.max(2, r.players.size) && n <= 8) { r.max = n; sync(r); } });
  socket.on('host:start', () => { const r = rooms[S.host]; if (r && r.phase === 'lobby' && r.players.size >= 2) startCount(r); });
  socket.on('host:again', () => {
    const r = rooms[S.host]; if (!r || r.phase !== 'over') return;
    r.round = 0; r.used.clear();
    for (const p of r.players.values()) { p.lives = 3; p.shield = false; p.power = null; io.to(p.sid).emit('power', null); }
    startCount(r);
  });

  socket.on('player:join', ({ code, name, avatar, token, photo }, ack) => {
    const r = rooms[String(code || '').toUpperCase()];
    if (!r) { console.log(`Join failed: room "${code}" not found. Open rooms:`, Object.keys(rooms)); return ack({ err: 'room' }); }
    let p = token && [...r.players.values()].find(x => x.token === token);
    if (p) { p.sid = socket.id; p.online = true; }
    else {
      if (r.phase !== 'lobby') return ack({ err: 'started' });
      if (r.players.size >= r.max) return ack({ err: 'full' });
      name = String(name || '').replace(/[<>&"'`]/g, '').trim().slice(0, 12);
      if (!name) return ack({ err: 'name' });
      if (!avatar) return ack({ err: 'avatar' });
      if ([...r.players.values()].some(x => x.avatar === avatar)) return ack({ err: 'taken' });
      p = { id: rid(), token: rid(), name, avatar, photo: (typeof photo === 'string' && photo.startsWith('data:image/png;base64,') && photo.length < 90000) ? photo : null, lives: 3, shield: false, power: null, frozenUntil: 0, sid: socket.id, online: true };
      r.players.set(p.id, p);
    }
    S.code = r.code; S.pid = p.id; socket.join(r.code);
    ack({ ok: 1, id: p.id, token: p.token, code: r.code });
    sync(r);
    if (r.phase === 'grid') {
      socket.emit('grid', { grid: r.grid, clue: r.clue });
      if (p.power) socket.emit('power', { key: p.power, ...POWERS[p.power] });
      if (r.crate) socket.emit('crate', { id: r.crate.id });
    }
  });
  socket.on('tap', e => {
    const r = room(), p = me();
    if (!r || !p || r.phase !== 'grid' || p.lives <= 0 || Date.now() < p.frozenUntil) return;
    if (!e || !r.grid.includes(e)) return;            // ignore blanks / already removed animals
    if (e === r.target) return win(r, p);
    p.frozenUntil = Date.now() + FREEZE_MS;
    socket.emit('frozen', { ms: FREEZE_MS, wrong: true });
    // the wrong animal is eliminated from the board for everybody (keeps rounds short)
    r.grid = r.grid.map(x => x === e ? '' : x);
    io.to(r.code).emit('remove', { emoji: e });
    say(r, 'wrong', { av: p.avatar, n: p.name, e }, 'wrong');
  });
  socket.on('grab', id => {
    const r = room(), p = me();
    if (!r || !p || r.phase !== 'grid' || p.lives <= 0 || p.power || Date.now() < p.frozenUntil) return;
    if (!r.crate || r.crate.id !== id) return;
    const k = r.crate.key; clearTimeout(r.t4); r.crate = null; p.power = k;
    io.to(r.code).emit('crate', null);
    io.to(p.sid).emit('power', { key: k, ...POWERS[k] });
    say(r, 'grab', { av: p.avatar, n: p.name }, 'grab');
    sync(r);
  });
  socket.on('usePower', () => { const r = room(), p = me(); if (r && p) usePower(r, p); });
  socket.on('target', id => { const r = room(), p = me(); if (r && p && r.phase === 'target' && r.winner === p.id && r.players.has(id)) hit(r, id); });
  socket.on('disconnect', () => {
    const r = room(); if (!r) return;
    if (S.host) {
      if (r.hostSid !== socket.id) return;   // an old socket of a host that already reconnected
      // host closed the tab: the room closes after a short grace period (a page refresh reconnects in time)
      r.hostOff = setTimeout(() => { clearT(r); io.to(r.code).emit('closed'); delete rooms[r.code]; }, HOST_GRACE_MS);
    }
    else { const p = me(); if (p) { p.online = false; sync(r); } }
  });
});

srv.listen(PORT, () => console.log(`\n🐾 Just Catch It!\n   Host screen:  http://localhost:${PORT}/host\n   Phones (same Wi-Fi): http://${lan()}:${PORT}\n`));
