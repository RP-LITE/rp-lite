const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Challenges extends Model {}

Challenges.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    challenger_id: {
      type: DataTypes.INTEGER,
    },
    target_id: {
      type: DataTypes.INTEGER,
    },
    challenge_object: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "Challenges",
  }
);

module.exports = Challenges;
