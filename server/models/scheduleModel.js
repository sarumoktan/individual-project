const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Schedule = sequelize.define(
  "Schedule",
  {
    schedule_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    operator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
      onDelete: "CASCADE",
    },

    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    stops: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },

    departure_time: {
      type: DataTypes.STRING(5), 
      allowNull: false,
    },

    arrival_time: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },

    frequency: {
      type: DataTypes.ENUM("Daily", "Weekly", "One-time"),
      allowNull: false,
    },

    // ["Mon","Wed","Fri"] — only populated when frequency = Weekly
    days: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    // Only populated when frequency = One-time
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "schedules",
  },
);

module.exports = Schedule;
