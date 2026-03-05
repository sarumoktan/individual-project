const Register = require("./userModel");
const Bus = require("./busModel");
const Staff = require("./staffModel");
const Schedule = require("./scheduleModel");
const Booking = require("./bookingModel");

// ── User → Buses (Operator relationship) ──────────────────────────────────────
Register.hasMany(Bus, { foreignKey: "operator_id", as: "buses", onDelete: "CASCADE" });
Bus.belongsTo(Register, { foreignKey: "operator_id", as: "operator" });

// ── User → Staff ──────────────────────────────────────────────────────────────
Register.hasMany(Staff, { foreignKey: "operator_id", as: "staff", onDelete: "CASCADE" });
Staff.belongsTo(Register, { foreignKey: "operator_id", as: "operator" });

// ── User → Schedules ──────────────────────────────────────────────────────────
Register.hasMany(Schedule, { foreignKey: "operator_id", as: "schedules", onDelete: "CASCADE" });
Schedule.belongsTo(Register, { foreignKey: "operator_id", as: "operator" });

// ── Bus → Schedules ───────────────────────────────────────────────────────────
Bus.hasMany(Schedule, { foreignKey: "bus_id", as: "schedules", onDelete: "CASCADE" });
Schedule.belongsTo(Bus, { foreignKey: "bus_id", as: "bus" });

// ── Staff → Schedules (Driver & Conductor) ────────────────────────────────────
Staff.hasMany(Schedule, { foreignKey: "driver_id", as: "drivingSchedules" });
Staff.hasMany(Schedule, { foreignKey: "conductor_id", as: "conductingSchedules" });
Schedule.belongsTo(Staff, { foreignKey: "driver_id", as: "driver" });
Schedule.belongsTo(Staff, { foreignKey: "conductor_id", as: "conductor" });

// ── Booking Associations (The New Part) ───────────────────────────────────────

// 1. A User can have many bookings
Register.hasMany(Booking, { foreignKey: "user_id", as: "userBookings", onDelete: "CASCADE" });
Booking.belongsTo(Register, { foreignKey: "user_id", as: "passenger" });

// 2. A Schedule can have many bookings
Schedule.hasMany(Booking, { foreignKey: "schedule_id", as: "bookings", onDelete: "CASCADE" });
Booking.belongsTo(Schedule, { foreignKey: "schedule_id", as: "schedule" });

module.exports = { Register, Bus, Staff, Schedule, Booking };