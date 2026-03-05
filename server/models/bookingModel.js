const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Booking = sequelize.define("Booking", {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  num_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  traveller_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  traveller_email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },

  traveller_phone: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },

  booking_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Booking;