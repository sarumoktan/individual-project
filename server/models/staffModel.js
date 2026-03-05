const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Staff = sequelize.define(
  "Staff",
  {
    staff_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("Driver", "Conductor", "Counter Staff"),
      allowNull: false,
    },

    // File paths saved by multer
    profile_url: { type: DataTypes.STRING, allowNull: true },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "staff",
  },
);

module.exports = Staff;
