const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'soundroom.db');
const schemaPath = path.join(__dirname, 'schema.sql');

const db = new Database(dbPath);

const schema = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schema);

console.log('Database initialized at', dbPath);

module.exports = db;


// --- temporary test code, remove after confirming it works ---
const testUser = db.prepare(`
  INSERT INTO users (id, username, email, password_hash)
  VALUES (?, ?, ?, ?)
`);
testUser.run('user-1', 'testuser', 'test@example.com', 'fakehash123');

const allUsers = db.prepare('SELECT * FROM users').all();
console.log('Users in DB:', allUsers);
// --- end temporary test code ---