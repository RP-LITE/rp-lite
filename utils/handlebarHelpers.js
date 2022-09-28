const hbs = require('handlebars');

const typeLevel = (creature)=>creature[`${creature.type}_lvl`];
hbs.registerHelper('typeLevel',typeLevel);

module.exports = hbs;