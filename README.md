# Soundroom

A social music-sharing web app. Join themed listening rooms, queue tracks
with a note on why you picked them, see who's live, and chat in real time.

## Tech stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3)
- Real-time: Socket.io

## Getting started (first-time setup)

1. Clone the repo:

```bash
   git clone https://github.com/suxcii/Soundroom.git
   cd Soundroom
```

2. Install client dependencies:

```bash
   cd client
   npm install
```

3. Install server dependencies:

```bash
   cd ../server
   npm install
```

4. Create `server/.env` and add a secret for login tokens:

```
   JWT_SECRET=pick_any_long_random_text
```

5. Create the database (makes `soundroom.db` with all tables):

```bash
   node db.js
```

## Running the app

Open two terminals at the same time.

**Terminal 1 (backend):**

```bash
cd server
node index.js
```

Runs on http://localhost:3001

**Terminal 2 (frontend):**

```bash
cd client
npm run dev
```

Runs on http://localhost:5173 (or the next free port)

## Keeping your copy up to date

Before each work session:

```bash
git pull
```

If `package.json` changed, run `npm install` again in that folder
(`client` or `server`).
