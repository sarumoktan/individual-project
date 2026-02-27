import BusSchedule from '../models/busSchedule.js';

export const createBusSchedule = async (req, res) => {
  try {
    const busSchedule = new BusSchedule(req.body);
    await busSchedule.save();
    res.status(201).json(busSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getAllBusSchedules = async (req, res) => {
  try {
    const schedules = await BusSchedule.find();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const getBusScheduleByID = async (req, res) => {
  try {
    const schedule = await BusSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Bus Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const updateBusSchedule = async (req, res) => {
  try {
    const updatedSchedule = await BusSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Bus Schedule not found' });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const deleteBusSchedule = async (req, res) => {
  try {
    const deletedSchedule = await BusSchedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      return res.status(404).json({ error: 'Bus Schedule not found' });
    }
    res.status(200).json({ message: 'Bus Schedule deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
