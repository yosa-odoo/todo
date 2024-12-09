/*
A lightweight template engine for Node.js that supports
- dynamic HTML rendering using a custom **Lodash Template** build
- asynchronous file handling with **fs.promises**
- support for partial templates through the `{% include %}` syntax.
*/

const fs = require('fs').promises;
const _ = require('./custom_modules/lodash.custom.js');

async function includePartial(baseView) {
  const reg = /{%\s+include?\s+(.*?)\s+%}/mg;
  let template = baseView;

  while(true) {
    const match = reg.exec(template);
    if (!match) return template;

    const partial = match[1]
    let partialContent = await fs.readFile(`./views/${partial}.html`, 'utf-8');

    template = template.replace(match[0], partialContent)
  }
}

async function render(view, ctx = {}) {
  let content = await fs.readFile(`./views/${view}.html`, 'utf-8');
  content = await includePartial(content)
  return _.template(content)(ctx);
}

module.exports = { render }