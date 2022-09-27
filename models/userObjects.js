const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const fs = require('fs/promises');

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
    type:{
      type: DataTypes.STRING,
      validate:{
        is: /^(?:scissor|rock|paper)$/
      }
    },
    name:{
      type: DataTypes.STRING,
      allowNull:false
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
    },
    is_charming:{
      type: DataTypes.BOOLEAN,
      defaultValue:false
    }
  },
  {
    hooks:{
      beforeCreate: async (newData) => {
        const files = await fs.opendir(`../../public/portraits/${newData.type}`);
        const fileArr = [];
        console.log('======================');
        console.log('========newData=======');
        console.log(newdata);
        console.log('======================');
        for await(const dirent of dir){
          fileArr.push(dirent.name);
        }
        const chosenIndex = Math.floor(Math.random() * fileArr.length);
        newData.img = `./public/portraits/${newData.type}/${fileArr[chosenIndex]}`;
        console.log('===================================');
        console.log('=====================new image path',newData.img);
        console.log('===================================');
        return newData;
      }
    },
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "userobjects",
  }
);

module.exports = UserObjects;