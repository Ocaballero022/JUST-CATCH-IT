// Interface translations (English / Español) shared by host + phones.
// To add a language: add a block below, a button with data-l="xx" in .langsw, and the clue files on the server.
const I18N = {
en: {
  title: 'Just Catch It! Host',
  reconnecting: '📡 Reconnecting…',
  'h.reconnecting': '📡 Reconnecting… the game keeps going',
  'h.music': 'Music on/off',
  'h.tap': '🎵 Click anywhere to turn on the music!',
  'h.go': 'On your phone, go to',
  'h.players': 'Number of players',
  'h.lang': 'Game language',
  'h.waiting': 'Waiting for players…',
  'h.start': 'Start game',
  'h.need': 'Need at least 2 players.',
  'h.ready': '{n} ready. Slots: {m}.',
  'h.getready': 'Get ready!',
  'h.round': 'Round {n}. Remember this clue!',
  'h.find': '🔎 Find it! No time limit, first to tap wins!',
  'h.roundwin': '{a} {n} wins the round!',
  'h.itwas': '{e} It was the {x}. Choosing who loses a life…',
  'h.blocked': '🛡️ Blocked!',
  'h.shieldsaved': "{n}'s shield saved them.",
  'h.ouch': '💔 Ouch!',
  'h.loses': '{a} {n} loses a life.',
  'h.losesOut': '{a} {n} loses a life and is out!',
  'h.over': 'Game over',
  'h.last': '{n} is the last one standing!',
  'h.draw': 'Draw!',
  'h.again': 'Play again',
  'h.new': 'Close room & new game',
  'p.code': 'ROOM CODE',
  'p.name': 'Your name',
  'p.photo': '📸 Take a photo (optional)',
  'p.retake': '📸 Retake photo',
  'p.remove': '✖ Remove photo',
  'p.nophoto': 'No photo? Your animal will dance instead! 💃',
  'p.join': 'Join game',
  'p.host': 'Host a game on this screen',
  'p.in': "You're in!",
  'p.count': '{n} of {m} players',
  'p.waitHost': 'Waiting for the host to start the game…',
  'p.watching': 'watching',
  'p.round': 'Round <b>{n}</b>. Remember this clue!',
  'p.wrong': '❌ Wrong animal!',
  'p.frozen': '🧊 Frozen by a rival!',
  'p.use': '{i} Use {p}!',
  'p.caught': '{a} {n} caught the {e} {x}!',
  'p.chooseT': '🎯 You got it!',
  'p.chooseS': 'Pick a player to lose a life',
  'p.blockedHit': "🛡️ {n}'s shield blocked the hit!",
  'p.hit': '💔 {a} {n} loses a life!',
  'p.hitOut': '💔 {a} {n} loses a life and is OUT!',
  'p.over': 'Game over',
  'p.youWin': '🏆 You win!',
  'p.wins': '{n} wins!',
  'p.drawT': 'Draw',
  'p.rematch': 'Watch the big screen for a rematch.',
  'p.closed': 'The host closed this room.',
  'e.room': 'Room not found. Check the code on the host screen (refresh the host page if the server was restarted).',
  'e.started': 'That game has already started.',
  'e.full': 'This room is full.',
  'e.name': 'Type your name first.',
  'e.avatar': 'Pick an animal avatar.',
  'e.taken': 'Someone already took that animal. Pick another.',
  'f.crate': '🎁 A mystery crate is flying around! Catch it!',
  'f.used': '{av} {n} used {i} {p}!',
  'f.grab': '{av} {n} grabbed the crate! 🎁',
  'f.wrong': '{av} {n} tapped {e}. Wrong! 🥶 It is removed from the board.',
  'pw.freeze': 'Ice Freeze', 'pw.ink': 'Ink Splash', 'pw.double': 'Double Vision', 'pw.radar': 'Radar Hint',
  'pw.scramble': 'Soup Scramble', 'pw.shrink': 'Shrink Ray', 'pw.flip': 'Upside Down', 'pw.mirror': 'Mirror Madness',
  'pw.zoom': 'Zoom Trap', 'pw.eagle': 'Eagle Eye', 'pw.fog': 'Fog Bomb', 'pw.spin': 'Crazy Spin',
  'pw.disco': 'Disco Fever', 'pw.quake': 'Earthquake', 'pw.ghost': 'Ghost Mode', 'pw.dark': 'Lights Out',
  'pw.bounce': 'Bouncy Ball', 'pw.drunk': 'Dizzy Dance', 'pw.broom': 'Magic Broom', 'pw.crystal': 'Crystal Ball'
},
es: {
  title: 'Just Catch It! Anfitrión',
  reconnecting: '📡 Reconectando…',
  'h.reconnecting': '📡 Reconectando… el juego sigue',
  'h.music': 'Música sí/no',
  'h.tap': '🎵 ¡Haz clic en cualquier lugar para activar la música!',
  'h.go': 'En tu celular, entra a',
  'h.players': 'Número de jugadores',
  'h.lang': 'Idioma del juego',
  'h.waiting': 'Esperando jugadores…',
  'h.start': 'Empezar juego',
  'h.need': 'Se necesitan al menos 2 jugadores.',
  'h.ready': '{n} listos. Cupos: {m}.',
  'h.getready': '¡Prepárense!',
  'h.round': 'Ronda {n}. ¡Recuerda esta pista!',
  'h.find': '🔎 ¡Encuéntralo! Sin límite de tiempo, ¡gana el primero en tocarlo!',
  'h.roundwin': '¡{a} {n} gana la ronda!',
  'h.itwas': '{e} La respuesta era: {x}. Eligiendo quién pierde una vida…',
  'h.blocked': '🛡️ ¡Bloqueado!',
  'h.shieldsaved': 'El escudo de {n} lo salvó.',
  'h.ouch': '💔 ¡Ay!',
  'h.loses': '{a} {n} pierde una vida.',
  'h.losesOut': '¡{a} {n} pierde una vida y queda fuera!',
  'h.over': 'Fin del juego',
  'h.last': '¡{n} es el último en pie!',
  'h.draw': '¡Empate!',
  'h.again': 'Jugar otra vez',
  'h.new': 'Cerrar sala y nuevo juego',
  'p.code': 'CÓDIGO DE SALA',
  'p.name': 'Tu nombre',
  'p.photo': '📸 Tomar una foto (opcional)',
  'p.retake': '📸 Repetir foto',
  'p.remove': '✖ Quitar foto',
  'p.nophoto': '¿Sin foto? ¡Tu animal bailará en su lugar! 💃',
  'p.join': 'Unirme al juego',
  'p.host': 'Ser anfitrión en esta pantalla',
  'p.in': '¡Estás dentro!',
  'p.count': '{n} de {m} jugadores',
  'p.waitHost': 'Esperando a que el anfitrión empiece el juego…',
  'p.watching': 'mirando',
  'p.round': 'Ronda <b>{n}</b>. ¡Recuerda esta pista!',
  'p.wrong': '❌ ¡Animal equivocado!',
  'p.frozen': '🧊 ¡Congelado por un rival!',
  'p.use': '¡{i} Usar {p}!',
  'p.caught': '¡{a} {n} encontró {e} {x}!',
  'p.chooseT': '🎯 ¡Lo lograste!',
  'p.chooseS': 'Elige a un jugador para que pierda una vida',
  'p.blockedHit': '🛡️ ¡El escudo de {n} bloqueó el golpe!',
  'p.hit': '💔 ¡{a} {n} pierde una vida!',
  'p.hitOut': '💔 ¡{a} {n} pierde una vida y queda FUERA!',
  'p.over': 'Fin del juego',
  'p.youWin': '🏆 ¡Ganaste!',
  'p.wins': '¡{n} gana!',
  'p.drawT': 'Empate',
  'p.rematch': 'Mira la pantalla grande para la revancha.',
  'p.closed': 'El anfitrión cerró esta sala.',
  'e.room': 'Sala no encontrada. Revisa el código en la pantalla del anfitrión (actualiza la página del anfitrión si el servidor se reinició).',
  'e.started': 'Ese juego ya empezó.',
  'e.full': 'Esta sala está llena.',
  'e.name': 'Escribe tu nombre primero.',
  'e.avatar': 'Elige un animal como avatar.',
  'e.taken': 'Alguien ya eligió ese animal. Elige otro.',
  'f.crate': '🎁 ¡Una caja misteriosa vuela por ahí! ¡Atrápala!',
  'f.used': '¡{av} {n} usó {i} {p}!',
  'f.grab': '¡{av} {n} agarró la caja! 🎁',
  'f.wrong': '{av} {n} tocó {e}. ¡Mal! 🥶 Se quita del tablero.',
  'pw.freeze': 'Congelación de Hielo', 'pw.ink': 'Chorro de Tinta', 'pw.double': 'Visión Doble', 'pw.radar': 'Pista de Radar',
  'pw.scramble': 'Sopa Revuelta', 'pw.shrink': 'Rayo Encogedor', 'pw.flip': 'Al Revés', 'pw.mirror': 'Locura de Espejo',
  'pw.zoom': 'Trampa de Zoom', 'pw.eagle': 'Ojo de Águila', 'pw.fog': 'Bomba de Niebla', 'pw.spin': 'Giro Loco',
  'pw.disco': 'Fiebre Disco', 'pw.quake': 'Terremoto', 'pw.ghost': 'Modo Fantasma', 'pw.dark': 'Apagón',
  'pw.bounce': 'Pelota Saltarina', 'pw.drunk': 'Baile Mareado', 'pw.broom': 'Escoba Mágica', 'pw.crystal': 'Bola de Cristal'
}
};
const detectLang = () => {
  const s = localStorage.jcLang;
  if (s === 'en' || s === 'es') return s;
  return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
};
let LANG = detectLang();
const T = (k, a) => {
  let s = (I18N[LANG] && I18N[LANG][k]) ?? I18N.en[k] ?? k;
  if (a) for (const x in a) s = s.split('{' + x + '}').join(a[x]);
  return s;
};
const animalName = a => (a && typeof a === 'object') ? (a[LANG] || a.en) : a;
function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i]').forEach(e => e.textContent = T(e.dataset.i));
  document.querySelectorAll('[data-ph]').forEach(e => e.placeholder = T(e.dataset.ph));
  document.querySelectorAll('[data-t]').forEach(e => e.title = T(e.dataset.t));
  document.querySelectorAll('.langsw button').forEach(b => b.classList.toggle('sel', b.dataset.l === LANG));
  if (document.body.dataset.title) document.title = T(document.body.dataset.title);
}
// silent = don't fire window.onLang (used when the language comes from the server)
function setLang(l, silent) {
  if (l !== 'en' && l !== 'es') return;
  LANG = l; localStorage.jcLang = l; applyLang();
  if (!silent && window.onLang) window.onLang(l);
}
document.addEventListener('click', e => { const b = e.target.closest('.langsw button'); if (b) setLang(b.dataset.l); });
