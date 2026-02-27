import mongoose from 'mongoose';

const busScheduleSchema = new mongoose.Schema({
  routeNo: { type: Number, required: true },
  departure: {
    city: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }
  },
  arrival: {
    city: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }
  },
  duration: { type: String, required: true },
  busType: { type: String, required: true },
  model: { type: String, required: true },
  busScheduleID: { type: String, required: true },
  depotName: { type: String, required: true },
  bookingClosingDate: { type: Date, required: true },
  bookingClosingTime: { type: String, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true }
});

const BusSchedule = mongoose.model('BusSchedule', busScheduleSchema);

export default BusSchedule;
