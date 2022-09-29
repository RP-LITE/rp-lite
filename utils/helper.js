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

// Handlebar Helpers
const typeLevel = (creature)=>creature[`${creature.type}_lvl`];

const isAttacker = (challenge,user)=> challenge.challenger_id === user.dataValues.id;

module.exports = { names:{rock,paper,scissor},typeLevel,isAttacker };