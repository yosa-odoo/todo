const express = require('express')
const app = express()
const port = 3000
var _ = require('lodash');
const {readFileSync} = require("fs");

// const process = require('node:process');

/*const { DatabaseSync } = require('node:sqlite');
const database = new DatabaseSync(':memory:');



database.exec(`
  CREATE TABLE data(
    key INTEGER PRIMARY KEY,
    task TEXT,
    state TEXT
  )
`);*/

app.get("/", async (req, res) => {
  // const query = database.prepare('SELECT * FROM data ORDER BY key');

  res.send(render("index", {tasks: ['task1', 'task2', 'task3']}))
})

function render(view, ctx = {}) {
  return _.template(readFileSync(`./views/${view}.html`))(ctx)
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})