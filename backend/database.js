const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Использование в памяти, можно изменить на файл

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, score INTEGER)");
  db.run("CREATE TABLE problems (id INTEGER PRIMARY KEY, question TEXT, answer TEXT)");
});

module.exports = db;
