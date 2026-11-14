# 🐾 Just Catch It!

Real-time party game for 2–8 players. One big screen (host) + everyone's phone as controller.

🌎 **Bilingual: English / Español.** Juego de fiesta en tiempo real para 2–8 jugadores: una pantalla grande (anfitrión) y el celular de cada uno como control.

## Languages / Idiomas
- **Host screen**: choose **English** or **Español** in the lobby ("Game language"). This sets the host interface *and* the clues + animal names for the whole room.
- **Phones**: each player has an **EN | ES** switch (top-right of the join/wait screens). The first time it uses the phone's language; the choice is remembered. A phone can be in English while the room's clues are in Spanish.
- Game messages are sent as keys and each screen translates them, so players can mix interface languages in the same room.

## Run locally
1. Node.js 18+
2. `npm install`
3. `npm start`
4. Open **http://localhost:3000/host** on a laptop/TV (click once on the page so the music can play).
5. Friends on the same Wi-Fi scan the QR, enter a name, pick an animal.
6. Host presses **Start game** → 3…2…1…GO!

## How it plays
- 3 lives each. A clue shows for 5 seconds, then a full-screen grid of 96 animals appears on every phone.
- **No timer in the grid**: the round lasts until someone finds the right animal. Wrong tap = frozen 3 s and that animal is removed from everyone's board.
- A 🎁 mystery crate flies around the board 8 s after the grid appears. The first player to tap it gets a power-up. After that power is used, the next crate appears 8 s later.
- 20 powers (each with its own sound); the same power never repeats within 8 crates:
  - Attacks: Ice Freeze, Ink Splash, Double Vision, Shrink Ray, Upside Down, Mirror Madness, Zoom Trap, Fog Bomb, Crazy Spin, Disco Fever, Earthquake, Ghost Mode, Lights Out, Bouncy Ball, Dizzy Dance.
  - Help / chaos: Soup Scramble (everyone), Radar Hint, Eagle Eye, Magic Broom, Crystal Ball (only you).
- Last player alive wins: fanfare, applause, confetti, and the losers cry in the background 😭
- Music plays on the host screen (intro in the lobby, a faster tense track during the game). 🔊 button = mute.

## Game over options
When the game ends the host screen shows two buttons:
- **Play again**: same room, same players, lives reset.
- **Close room & new game**: closes the current room (all phones are sent back to the start screen) and immediately opens a new room with a **new code and QR**, so a different group can join.

## Clues
- `animals.js` / `clues.js`: English. 60 animals (emoji, name, fallback clue) + 3 simple clues each.
- `animals_es.js` / `clues_es.js`: Español. Same keys (the English animal name): `[nombre, pista de respaldo]` and 3 pistas each.
- Each round picks one clue at random from the 3 + the fallback (4 per animal) in the room's language. Add more freely.
- Interface texts live in `public/i18n.js`. To add another language: add a block there, a button with `data-l="xx"` in the `.langsw` switches, the two clue files, and the `r.lang` checks in `server.js`.

## Photos
Players can take an optional selfie (their phone camera opens) and add an animal/crown/glasses filter. Photos stay in server memory only and disappear when the room closes. Players without a photo get a dancing animal emoji.

## Project structure
```
just-catch-it/
├── server.js        # Express + Socket.IO game server
├── animals.js       # animal list (EN)
├── clues.js         # clues per animal (EN)
├── animals_es.js    # animal names + fallback clue (ES)
├── clues_es.js      # clues per animal (ES)
├── render.yaml      # Render Blueprint
├── package.json
├── README.md
├── .gitignore
└── public/
    ├── index.html   # player (phone) screen
    ├── host.html    # host (TV / laptop) screen
    ├── style.css
    ├── i18n.js      # EN/ES interface texts
    ├── sfx.js       # sounds + music
    └── fx.js        # visual effects
```

## Notes
- Players and the host must be on the same Wi-Fi network when running locally.
- Rooms live in server memory: restarting the server closes all rooms.
- If the host closes the game tab, the room closes after 10 seconds (a page refresh reconnects in time). Phones go back to the start screen and the host can open a new room.

## Deploy on Render (free) + GitHub
1. Push this folder to a GitHub repo (`git init`, `git add .`, `git commit -m "Just Catch It"`, then push).
2. On [render.com](https://render.com): **New → Web Service** → pick the repo.
3. Settings: **Runtime** Node, **Build command** `npm install`, **Start command** `npm start` (or use the included `render.yaml` as a Blueprint). Render sets `PORT` automatically.
4. When it is live, open `https://YOUR-APP.onrender.com/host` on the big screen. The QR and the room code use that public URL, so phones do **not** need to be on the same Wi-Fi.

Notes for Render:
- The free plan sleeps after ~15 min without traffic; the first visit takes ~30–50 s to wake up. Open `/host` a minute before playing.
- Rooms live in memory: if Render restarts or redeploys, open `/host` again to get a new room.
