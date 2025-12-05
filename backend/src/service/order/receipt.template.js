const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

const templatePath = path.join(__dirname, 'templates', 'receipt.hbs');
const templateString = fs.readFileSync(templatePath, 'utf8');


const template = Handlebars.compile(templateString);


function renderReceiptHtml(viewModel) {
  return template(viewModel);
}

module.exports = { renderReceiptHtml };
