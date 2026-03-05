const { Booking, Schedule, Bus, Staff } = require("../models/association");

// 1. Create Booking (With capacity check)
const createBooking = async (req, res) => {
  try {
    const { schedule_id, num_seats, traveller_name, traveller_email, traveller_phone } = req.body;

    // Validate required traveller fields
    if (!traveller_name || !traveller_phone) {
      return res.status(400).json({ message: "Traveller name and phone are required" });
    }

    const schedule = await Schedule.findByPk(schedule_id, {
      include: [{ model: Bus, as: "bus" }],
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    if (!schedule.bus) {
      return res.status(404).json({ message: "No bus assigned to this schedule" });
    }

    // Calculate current occupancy
    const totalBooked = await Booking.sum("num_seats", { where: { schedule_id } }) || 0;

    if (totalBooked + parseInt(num_seats) > schedule.bus.seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const booking = await Booking.create({
      user_id: req.user.user_id,
      schedule_id,
      num_seats,
      traveller_name,
      traveller_email: traveller_email || null,
      traveller_phone,
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// 2. Update Booking (Modify number of seats + traveller details)
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { num_seats, traveller_name, traveller_email, traveller_phone } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (num_seats !== undefined) booking.num_seats = num_seats;
    if (traveller_name !== undefined) booking.traveller_name = traveller_name;
    if (traveller_email !== undefined) booking.traveller_email = traveller_email;
    if (traveller_phone !== undefined) booking.traveller_phone = traveller_phone;

    await booking.save();

    res.json({ success: true, message: "Booking updated", booking });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 3. Delete/Cancel Booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.destroy({ where: { booking_id: id } });
    res.json({ success: true, message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

// 4. Get Occupancy for a Schedule
const getOccupancy = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findByPk(scheduleId, {
      include: [{ model: Bus, as: "bus" }],
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const bookedCount = await Booking.sum("num_seats", {
      where: { schedule_id: scheduleId },
    }) || 0;

    const totalSeats = schedule.bus ? schedule.bus.seats : 0;

    res.json({
      total_seats: totalSeats,
      booked_seats: bookedCount,
      remaining: totalSeats - bookedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating seats", error: error.message });
  }
};

// 5. Get all bookings for the logged-in user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: Schedule,
          as: "schedule",
          include: [
            {
              model: Bus,
              as: "bus",
              attributes: ["plate", "class", "seats"],
            },
            {
              model: Staff,
              as: "driver",
              attributes: ["name", "phone"],
            },
            {
              model: Staff,
              as: "conductor",
              attributes: ["name", "phone"],
            },
          ],
          attributes: [
            "schedule_id",
            "origin",
            "destination",
            "departure_time",
            "arrival_time",
            "price",
          ],
        },
      ],
      order: [["booking_date", "DESC"]],
    });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

module.exports = { createBooking, updateBooking, deleteBooking, getOccupancy, getUserBookings };
