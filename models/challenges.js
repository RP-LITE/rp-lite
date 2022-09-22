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
      references: {
          model: "user",
          key: "id",
      }
    },
    target_id: {
      type: DataTypes.INTEGER,
      references: {
          model: "user",
          key: "id",
      }
    },
    challenge_object: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'userobjects',
        key: "id",
        unique: false
      }
    },
    target_object:{
      type: DataTypes.INTEGER,
      references:{
        model:'userobjects',
        key: "id",
        unique: false
      }
    },
    winner:{
      // refers to the winner's id
      type:DataTypes.INTEGER
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "challenges",
  }
);

module.exports = Challenges;
