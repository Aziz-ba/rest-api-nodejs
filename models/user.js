const { Model, DataTypes } = require("sequelize");
const connection = require("../lib/db");

class User extends Model {
  // Never leak the password hash in JSON responses.
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  }
}

User.init(
  {
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize: connection, modelName: "User" }
);

module.exports = User;
