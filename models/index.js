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

User.hasMany(Challenges,{
  foreignKey:'challenger_id'
});
Challenges.belongsTo(User,{
  foreignKey:'challenger_id'
});

User.hasMany(Challenges,{
  foreignKey:'target_id'
});
Challenges.belongsTo(User,{
  foreignKey:'target_id'
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
