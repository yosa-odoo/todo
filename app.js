require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const _ = require('lodash');
const dbModule = require('./db');

const app = express();
const port = process.env.PORT || 3000;
let db;

app.use(bodyParser.urlencoded({ extended: true })); // allow retrieving data from form

// Simple template engine
async function render(view, ctx = {}) {
  const content = await fs.readFile(`./views/${view}.html`, 'utf-8');
  return _.template(content)(ctx);
}

app.get('/', async (req, res, next) => {
  try {
    const tasks = await db.all('SELECT * FROM tasks');
    res.send(await render('index', { tasks }));
  } catch (err) {
    next(err);
  }
});

app.post('/add-task', async (req, res, next) => {
  try {
    const task = (req.body.task || '').trim(); // Ensure input is not undefined/null
    if (!task) {
      return res.status(400).send('Task cannot be empty');
    }
    await db.run("INSERT INTO tasks (task, state) VALUES (?, 'pending')", [task]);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

app.post('/delete-task/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    await db.run(`
      UPDATE tasks
      SET state = 'deleted'
      WHERE id = ?
    `, [taskId]);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

app.post('/update-task/:id', async (req, res, next) => {
  try {
    const taskId = req.params.id;
    await db.run(`
      UPDATE tasks
      SET state = CASE state WHEN 'pending' THEN 'completed' ELSE 'pending' END
      WHERE id = ?
    `, [taskId]);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

(async () => {
  try {
    await dbModule.initDb();
    db = dbModule.getDb();
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to initialize the app:', err);
  }
})();
