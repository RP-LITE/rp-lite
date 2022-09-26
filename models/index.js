// const User = require("./User");
const Connection = require("./Connection");
const User = require("./User");
const Challenges = require("./challenges");
const ObjectAbilities = require("./objectAbilities");
const UserObjects = require("./userObjects");
const Abilities = require("./abilities");

// Sequelize associations
User.hasMany(Connection,{
  foreignKey:'user_id'
});
Connection.belongsTo(User,{
  foreignKey:'user_id'
});
// Transfers.belongsTo(Accounts, { as: 'accountFrom', onDelete: 'cascade', onUpdate: 'no action' });
// Transfers.belongsTo(Accounts, { as: 'accountTo', onDelete: 'cascade', onUpdate: 'no action' });
User.hasMany(Challenges,{
  foreignKey:'challenger_id',
  as:'challenger',
  onDelete:'cascade'
});
Challenges.belongsTo(User,{
  foreignKey:'challenger_id',
  as:'challenger',
  onDelete:'cascade'
});
User.hasMany(Challenges,{
  foreignKey:'target_id',
  as:'target',
  onDelete:'SET NULL'
});
Challenges.belongsTo(User,{
  foreignKey:'target_id',
  as:'target',
  onDelete:'SET NULL'
});

UserObjects.hasMany(Challenges,{
  foreignKey:'challenge_object',
  as:'attacker',
  onDelete:'CASCADE'
});
Challenges.belongsTo(UserObjects,{
  foreignKey:'challenge_object',
  as:'attacker',
  onDelete:'CASCADE'
});

UserObjects.hasMany(Challenges,{
  foreignKey:'target_object',
  as: 'defender',
  onDelete:'SET NULL'
});
Challenges.belongsTo(UserObjects,{
  foreignKey:'target_object',
  as: 'defender',
  onDelete:'SET NULL'
});

User.hasMany(UserObjects,{
  foreignKey:'user_id'
});
UserObjects.belongsTo(User,{
  foreignKey:'user_id'
});

UserObjects.belongsToMany(Abilities,{through:ObjectAbilities,foreignKey:'user_object_id'});
Abilities.belongsToMany(UserObjects,{through:ObjectAbilities,foreignKey:'ability_id'});

module.exports = { Connection, User, Challenges, ObjectAbilities, UserObjects };
