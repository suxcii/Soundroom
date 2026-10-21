const db = require('better-sqlite3')('soundroom.db');
console.log(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
