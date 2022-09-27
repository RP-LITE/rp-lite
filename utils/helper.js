const { uniqueNamesGenerator, adjectives, colors,names, animals } = require('unique-names-generator');

const rock = ()=> uniqueNamesGenerator({
  dictionaries:[adjectives, names,animals],
  separator:"'"
});
const paper = () => uniqueNamesGenerator({
  dictionaries:[adjectives, colors,names],
  separator:"oro "
});
const scissor = () => uniqueNamesGenerator({
  dictionaries:[names, colors,animals],
  separator:"dau"
});

module.exports = { names:{rock,paper,scissor} };