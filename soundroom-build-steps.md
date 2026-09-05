# Soundroom — Build Steps

A running checklist for building the Soundroom MVP. Check items off as you complete them.

---

## Step 1: Scaffold the repo and tooling ✅ DONE

- [x] Create project folder: `mkdir soundroom && cd soundroom`
- [x] `git init` at the root
- [x] Add root `.gitignore`:
  ```
  node_modules/
  .env
  dist/
  *.log
  ```
- [x] Scaffold client: `npm create vite@latest client -- --template react`
- [x] `cd client && npm install`
- [x] Scaffold server: `mkdir server && cd server && npm init -y`
- [x] `npm install express cors`
- [x] Create `server/index.js`:
  ```js
  const express = require('express');
  const cors = require('cors');

  const app = express();
  app.use(cors());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  ```
- [x] Run server: `node index.js` → confirm `http://localhost:3001/health` returns `{"status":"ok"}`
- [x] Update `client/src/App.jsx` to fetch from the health check:
  ```jsx
  import { useState, useEffect } from 'react';

  function App() {
    const [status, setStatus] = useState('loading...');

    useEffect(() => {
      fetch('http://localhost:3001/health')
        .then((res) => res.json())
        .then((data) => setStatus(data.status))
        .catch(() => setStatus('error contacting server'));
    }, []);

    return (
      <div>
        <h1>Soundroom</h1>
        <p>Backend says: {status}</p>
      </div>
    );
  }

  export default App;
  ```
- [x] Run client: `npm run dev` → confirm browser shows "Backend says: ok"
- [x] Commit: `git add .` → `git commit -m "scaffold: client + server hello world"`
- [x] Create GitHub repo, link remote: `git remote add origin <url>`
- [x] `git branch -M main`
- [x] `git push -u origin main`

**Repo:** https://github.com/suxcii/Soundroom

---

## Step 2: Set up SQLite and the data model

- [ ] In `server`, install: `npm install better-sqlite3`
- [ ] Create `server/schema.sql` matching the design doc's Section 7:
  - `users` (id, username, email, password_hash, bio, favorite_genres, created_at)
  - `rooms` (id, name, mood_tag, created_by, created_at)
  - `room_members` (room_id, user_id, joined_at)
  - `queue_items` (id, room_id, track_id, track_name, added_by, note, added_at)
  - `chat_messages` (id, room_id, user_id, content, created_at)
- [ ] Write a small init script (e.g. `server/db.js`) that creates the DB file and runs the schema on first run
- [ ] Seed 1–2 fake users/rooms for testing
- [ ] Verify tables exist by querying them (e.g. with a quick script or a SQLite browser tool)

---

## Step 3: Build auth (register/login/JWT)

- [ ] Install: `npm install bcrypt jsonwebtoken`
- [ ] `POST /auth/register` — hash password with bcrypt, insert user, return JWT
- [ ] `POST /auth/login` — verify password, return JWT
- [ ] Auth middleware — verify JWT on protected routes
- [ ] `GET /auth/me` — return current user info
- [ ] Test all of the above with curl/Postman before touching the frontend

---

## Step 4: Build room + queue REST endpoints

- [ ] `GET /rooms` — list all rooms + member counts
- [ ] `POST /rooms` — create a room
- [ ] `POST /rooms/:id/join` — join a room (persistent membership)
- [ ] `GET /rooms/:id/members` — persistent member list
- [ ] `GET /rooms/:roomId/queue` — get shared queue
- [ ] `POST /rooms/:roomId/queue` — add track + note to queue

---

## Step 5: Wire up the React frontend to REST

- [ ] Login/register forms
- [ ] Room list page + create room UI
- [ ] Room view: show persisted member list + queue (fetched via REST, no live updates yet)

---

## Step 6: Add Socket.io for presence, live queue, and chat

- [ ] Install: `npm install socket.io` (server) and `socket.io-client` (client)
- [ ] Attach Socket.io to the same HTTP server as Express
- [ ] Authenticate socket connections using the JWT in the handshake
- [ ] Implement events:
  - `room:enter` (client → server)
  - `room:leave` (client → server)
  - `room:live_members` (server → client)
  - `queue:add` (server → client)
  - `chat:message` (both directions)
- [ ] Test with two browser tabs as different users — confirm live presence + chat work

---

## Step 7: Test against the MVP success criteria

- [ ] Two users register, join the same room, see each other listed as live
- [ ] Track + note added by one user appears in real time for the other
- [ ] Chat messages appear in real time for both users
- [ ] App survives a full walkthrough without crashing

---

## Step 8: Deploy (optional, do early if possible)

- [ ] Deploy `client` to Vercel
- [ ] Deploy `server` to Railway or Render
- [ ] Confirm CORS, env vars, and WebSocket support work on the hosted environment

---

## Open questions to revisit (from design doc)

- Chat retention: persist indefinitely (MVP) or expire after a time window?
- Room creation: open to anyone (MVP) or restricted somehow?
- Track identity: using track name as pseudo-ID risks duplicates until real Spotify search is added
