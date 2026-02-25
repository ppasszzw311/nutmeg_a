const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'sqlite.db');

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite:', err.message);
  } else {
    console.log('Success connected to local SQLite database');
  }
});

// Create a polyfill for mysql's conn.query(sql, [params], callback)
const con = {
  query: function (sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }

    // Auto-detect SELECT vs UPDATE/INSERT/DELETE
    const isSelect = sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('WITH');

    // SQLite uses basic ? parameters, occasionally mysql syntax might differ but ? works in both.
    if (isSelect) {
      db.all(sql, params, (err, rows) => {
        if (callback) callback(err, rows);
      });
    } else {
      db.run(sql, params, function (err) {
        if (callback) {
          callback(err, { insertId: this.lastID, affectedRows: this.changes });
        }
      });
    }
  }
};

module.exports = con;