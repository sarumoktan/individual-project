const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Bus = sequelize.define(
  "Bus",
  {
    bus_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    year: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },

    class: {
      type: DataTypes.ENUM("Luxury", "Semi-Luxury", "Standard"),
      allowNull: false,
    },

    comfort: {
      type: DataTypes.ENUM("AC", "Non-AC"),
      allowNull: false,
    },

    layout: {
      type: DataTypes.ENUM("Seater", "Sleeper", "Semi-Sleeper"),
      allowNull: false,
    },

    seats: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },

    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },

    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "buses",
  },
);

module.exports = Bus;
