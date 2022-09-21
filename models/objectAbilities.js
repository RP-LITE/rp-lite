const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const Abilities = require("./abilities");

class ObjectAbilities extends Model {}

ObjectAbilities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_object_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "userObjects",
        key: "id",
      }
    },
    ability_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Abilities",
        key: "id",
      }
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "objectAbilities",
  }
);

module.exports = ObjectAbilities;
