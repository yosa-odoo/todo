const fs = require('fs').promises;
const _ = require('lodash');

async function render(view, ctx = {}) {
  const content = await fs.readFile(`./views/${view}.html`, 'utf-8');
  return _.template(content)(ctx);
}

e