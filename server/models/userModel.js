const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Register = sequelize.define(
  "Users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    role: {
      type: DataTypes.ENUM("user", "conductor"),
      allowNull: false,
      defaultValue: "user",
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    verificationTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  },
);

module.exports = Register;
