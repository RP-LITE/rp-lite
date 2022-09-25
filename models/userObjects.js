const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class UserObjects extends Model {}

UserObjects.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      }
    },
    rock_lvl: {
      type: DataTypes.INTEGER,
    },
    paper_lvl: {
      type: DataTypes.INTEGER,
    },
    scissor_lvl: {
      type: DataTypes.INTEGER,
    },
    img: {
      type: DataTypes.STRING,
    },
    experience:{
      type: DataTypes.INTEGER,
      defaultValue:0
    },
    experience_threshold:{
      type: DataTypes.INTEGER,
      defaultValue:1
    }
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "userobjects",
  }
);

module.exports = UserObjects;
