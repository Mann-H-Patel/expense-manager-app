const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Ensure tables exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      description TEXT,
      amount REAL,
      date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;