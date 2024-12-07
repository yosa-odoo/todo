const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
var _ = require('lodash');
const {readFileSync} = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));

const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('./database.db');

database.run(`
  CREATE TABLE IF NOT EXISTS tasks(
    id INTEGER PRIMARY KEY,
    task TEXT,
    state TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error creating table:', err.message);
  }
});

// simple template engine
function render(view, ctx = {}) {
  return _.template(readFileSync(`./views/${view}.html`))(ctx)
}

app.get("/", (req, res) => {
  database.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err.message);
      return res.status(500).send('Error fetching tasks');
    }
    res.send(render("index", {tasks: rows}))
  });
});

app.post('/add-task', (req, res) => {
  const newTask = req.body.task.trim();
  if (newTask) {
    database.run("INSERT INTO tasks (task, state) VALUES (?, 'pending')", [newTask], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.redirect('/');
    });
  } else {
    res.redirect('/');
  }
});

app.post('/delete-task/:id', (req, res) => {
  const taskId = req.params.id;
  database.run("DELETE FROM tasks WHERE id = ?", [taskId], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.redirect('/');
  });
});

app.post('/update-task/:id', (req, res) => {
  const taskId = req.params.id;
  database.get("SELECT state FROM tasks WHERE id = ?", [taskId], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    const newState = (row.state === 'pending') ? 'completed' : 'pending';
    database.run("UPDATE tasks SET state = ? WHERE id = ?", [newState, taskId], function(err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.redirect('/');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})