const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

let db;

async function initDb() {
  db = await sqlite.open({
    filename: './database/todo.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY,
      task TEXT NOT NULL,
      state TEXT NOT NULL CHECK (state IN ('pending', 'completed'))
    )
  `);

  console.log('Database initialized');
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb first.');
  }
  return db;
}

module.exports = {
  initDb,
  getDb,
};
