const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const fs = require('fs/promises');
const path = require('path');

const assignImage = async (data) => {
  console.log('======================');
  console.log('===dirname',__dirname);
  console.log('========newData=======');
  console.log(data);
  console.log('======================');
  const newPath = path.resolve(__dirname,`../public/portraits/${data.type}/`);
  console.log('===dirpath',newPath);
  const files = await fs.opendir(newPath);
  const fileArr = [];
  for await(const dirent of files){
    fileArr.push(dirent.name);
  }
  const chosenIndex = Math.floor(Math.random() * fileArr.length);
  data.img = `portraits/${data.type}/${fileArr[chosenIndex]}`;
  console.log('===================================');
  console.log('=====================new image path',data.img);
  console.log('===================================');
  return data;
}

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
      beforeBulkCreate: async (newData) => {
        newData = await Promise.all(newData.map(assignImage))
      },
      beforeCreate: async (newData) => await assignImage(newData)
    },
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: "userobjects",
  }
);

module.exports = UserObjects;