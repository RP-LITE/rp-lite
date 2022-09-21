const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Connection extends Model {}

Connection.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      // Deliberately not auto increment. Will be addedbased on the socket's id.
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
        unique: false,
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "connection",
  }
);

module.exports = Connection;
