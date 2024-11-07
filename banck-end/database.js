const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(function() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY,
      text TEXT NOT NULL,
      price REAL NOT NULL,
      deadline DATE NOT NULL
    );
  `);
});

module.exports = db;