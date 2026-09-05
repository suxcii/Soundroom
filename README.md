# Soundroom

A social music-sharing web app — join themed listening rooms, queue tracks with a note on why you picked them, see who's live, and chat in real time.

## Tech stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** SQLite (via better-sqlite3)
- **Real-time:** Socket.io (coming in a later step)

## Getting started (first time setup)

1. Clone the repo:

git clone https://github.com/suxcii/Soundroom.git
cd Soundroom


2. Install client dependencies:

cd client
npm install


3. Install server dependencies:

cd ../server
npm install


4. Initialize the database (creates `soundroom.db` with all tables):

node db.js


## Running the app

You need **two terminals** running at the same time:

**Terminal 1 — backend:**

cd server
node index.js

Runs on `http://localhost:3001`

**Terminal 2 — frontend:**

cd client
npm run dev

Runs on `http://localhost:5173` (or the next available port)

## Keeping your local copy up to date

Before starting work each session:

git pull


If `package.json` changed (someone added a new dependency), also run `npm install` again in the relevant folder (`client` or `server`).

## Project status

See `soundroom-build-steps.md` for the full build checklist and current progress.
