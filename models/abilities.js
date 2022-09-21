const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Abilities extends Model {}

Abilities.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ability_name: {
      type: DataTypes.STRING,
      allowNull:false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Abilities",
  }
);

module.exports = Abilities;
