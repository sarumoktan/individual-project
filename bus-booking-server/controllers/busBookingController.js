import BusBooking from '../models/busBooking.js';  

export const createBooking = async (req, res) => {
  try {
    const booking = new BusBooking(req.body); 
    await booking.save();  
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error });
  }
};


export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BusBooking.find();  
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching bookings', error });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const booking = await BusBooking.findById(req.params.id); 
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching booking', error });
  }
};


export const updateBooking = async (req, res) => {
  try {
    const updatedBooking = await BusBooking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking updated successfully', updatedBooking });
  } catch (error) {
    res.status(400).json({ message: 'Error updating booking', error });
  }
};


export const deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await BusBooking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting booking', error });
  }
};
