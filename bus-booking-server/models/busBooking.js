import mongoose from 'mongoose';

const busBookingSchema = new mongoose.Schema({
  journeySummary: {
    routeNo: { type: Number, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    depotName: { type: String, required: true },
    seatNo: { type: Number, required: true },
    bookingDate: {
      startSession: { type: Date, default: Date.now },
      endSession: { type: Date, default: Date.now },
      startTime: { 
        type: String, 
        required: true, 
        validate: {
          validator: function (value) {
            return /^\d{2}:\d{2}$/.test(value); 
          },
          message: 'Invalid start time format. Use "HH:mm" format.'
        }
      },
      endTime: { 
        type: String, 
        required: true, 
        validate: {
          validator: function (value) {
            return /^\d{2}:\d{2}$/.test(value); 
          },
          message: 'Invalid end time format. Use "HH:mm" format.'
        }
      },
    },
  },
  status: { type: String, default: 'pending' },
  paymentDetails: {
    busFare: { type: String, required: true },
    convenienceFee: { type: String, required: true },
    bankCharge: { type: String, required: true },
    totalPay: { type: String, required: true },
  },
  customerDetails: {
    name: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    nationality: { type: String, required: true, default: "Sri Lanka" },
  },
});

const BusBooking = mongoose.model('BusBooking', busBookingSchema);

export default BusBooking;
