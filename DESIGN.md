# Soundroom — Technical Design Document

**Status:** Draft v1
**Team:** 2 engineers
**Type:** Course project — social music-sharing web app

---

## 1. Overview

Soundroom is a small social platform where students join themed "listening
rooms," queue up tracks with a short note on why they picked them, see who
else is live in the room, and chat. It is not a music streaming replica —
audio is embedded via the Spotify Web Player, not hosted or licensed by us.

## 2. Goals

- Let students discover music through each other, not an algorithm alone
- Give listening a social, real-time presence (you can see who's "in the room" with you)
- Pair each track with a short personal note — the "why," not just the "what"
- Keep the whole thing buildable by 2 people in ~4 weeks on a $0 budget

## 3. Non-goals (explicitly out of scope)

- Hosting or streaming actual audio files (licensing/legal risk, unnecessary — Spotify embeds cover this)
- Full recommendation engine / ML-based matching
- Native mobile apps (web only, mobile-responsive is a stretch goal)
- Payments, subscriptions, or any monetization
- Content moderation tooling beyond basic input sanitization (acceptable for a closed student user base)

## 4. Users & use cases

**Primary user:** A university student who wants to share music with classmates.

Core use cases:
1. Sign up / log in
2. Create or join a themed room (e.g., "Late Night Study")
3. See who else is currently in the room
4. Add a track to the room's shared queue with a short note
5. Chat with others in the room in real time
6. (Stretch) View another student's profile and their music notes/history

## 5. MVP scope

The MVP is the smallest version that demonstrates the core loop: **join a
room → see who's there → add a track with a note → chat.**

### In MVP
- Email/password auth (JWT)
- Create/list/join rooms
- Live "who's here" presence per room
- Shared track queue with notes (track name as free text is acceptable if Spotify search isn't ready yet)
- Real-time chat scoped to a room
- Minimal but usable UI (no design system needed)

### Explicitly deferred past MVP (stretch goals)
- Real Spotify API search + embedded player (falls back to plain text track names in MVP)
- User profiles with bio/genres
- Follow/unfollow between users
- Persisted chat history across sessions
- Reactions on queue items
- Deployment to a custom domain

## 6. System architecture

```
┌─────────────┐        HTTPS (REST)        ┌──────────────┐
│   React     │ ──────────────────────────▶ │   Express    │
│  (Vite SPA) │ ◀────────────────────────── │   (Node.js)  │
└─────────────┘                              └──────┬───────┘
      │                                              │
      │        WebSocket (Socket.io)                 │
      └──────────────────────────────────────────────┤
                                                       ▼
                                              ┌──────────────┐
                                              │   SQLite     │
                                              │ (better-sqlite3)│
                                              └──────────────┘
```

- **Frontend:** React SPA (Vite), talks to backend via REST for CRUD and
  Socket.io for real-time events (presence, chat, live queue updates)
- **Backend:** Single Express process, also hosts the Socket.io server on
  the same HTTP server instance
- **Database:** SQLite for MVP (zero-config, file-based, free). Swappable
  for Postgres later if hosting requires it (see Section 10)
- **Auth:** Stateless JWT, verified both on REST requests (middleware) and
  on Socket.io connection (handshake auth token)

## 7. Data model

```
users
  id (pk, uuid)
  username (unique)
  email (unique)
  password_hash
  bio
  favorite_genres
  created_at

rooms
  id (pk, uuid)
  name
  mood_tag
  created_by (fk -> users.id)
  created_at

room_members
  room_id (fk -> rooms.id)
  user_id (fk -> users.id)
  joined_at
  PRIMARY KEY (room_id, user_id)

queue_items
  id (pk, uuid)
  room_id (fk -> rooms.id)
  track_id
  track_name
  added_by (fk -> users.id)
  note
  added_at

chat_messages
  id (pk, uuid)
  room_id (fk -> rooms.id)
  user_id (fk -> users.id)
  content
  created_at
```

Note: `room_members` is *persistent* membership (you joined this room at
some point). Live presence ("who's here right now") is tracked separately,
in-memory on the server via Socket.io connections — it is not the same
table and is expected to reset on server restart.

## 8. API contract (REST)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create account, returns JWT |
| POST | `/auth/login` | No | Returns JWT |
| GET | `/auth/me` | Yes | Current user info |
| GET | `/rooms` | Yes | List all rooms + member counts |
| POST | `/rooms` | Yes | Create a room |
| POST | `/rooms/:id/join` | Yes | Join a room (persistent membership) |
| GET | `/rooms/:id/members` | Yes | Persistent member list |
| GET | `/rooms/:roomId/queue` | Yes | Get shared queue |
| POST | `/rooms/:roomId/queue` | Yes | Add track + note to queue |

## 9. Real-time events (Socket.io)

| Event | Direction | Payload | Description |
|---|---|---|---|
| `room:enter` | client → server | `roomId` | Join a room's live channel |
| `room:leave` | client → server | — | Leave current live channel |
| `room:live_members` | server → client | `string[]` (usernames) | Broadcast on join/leave |
| `queue:add` | server → client | queue item object | Broadcast when someone adds a track |
| `chat:message` | both directions | `{ roomId, content }` in / full message object out | Room-scoped chat |

## 10. Non-functional requirements

- **Cost:** $0 for development; free-tier hosting for deployment (Vercel + Railway/Render)
- **Scale:** Designed for a small closed user base (a class or club) — tens to low hundreds of concurrent users, not production scale. No need for horizontal scaling, caching layers, or CDN beyond what Vercel provides by default.
- **Security (MVP-appropriate, not production-grade):** passwords hashed with bcrypt, JWT-based auth, basic input validation. No rate limiting or advanced abuse protection in MVP — acceptable given closed, trusted user base.
- **Availability:** best-effort; no uptime SLA needed for a course project.

## 11. Tech stack summary

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev loop, widely taught, good learning value |
| Backend | Node.js + Express | Same language as frontend, minimal boilerplate |
| Real-time | Socket.io | Handles reconnects/fallbacks better than raw WebSockets for a first project |
| DB | SQLite (better-sqlite3) | Zero setup, file-based, free, fine for this scale |
| Auth | JWT + bcrypt | Simple, stateless, no session store needed |
| Music data | Spotify Web API (stretch) | Free, gives embeddable player — no audio hosting needed |

## 12. Success criteria for MVP demo

- Two users can register, join the same room, and see each other listed as live
- A track + note added by one user appears in real time for the other
- Chat messages appear in real time for both users
- The app survives a basic walkthrough without crashing

## 13. Open questions / decisions needed

- Do chat messages persist indefinitely or expire after a time window? (MVP: persist, simplest to build; revisit if it feels cluttered)
- Should room creation be open to anyone, or restricted somehow? (MVP: open to any logged-in user)
- Track identity without Spotify integration: using track name as a pseudo-ID risks duplicate/inconsistent entries — acceptable tradeoff for MVP, resolved once Spotify search lands
