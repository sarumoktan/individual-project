import express from 'express';
import { createBusSchedule, getAllBusSchedules, getBusScheduleByID, updateBusSchedule, deleteBusSchedule } from '../controllers/busScheduleController.js';

const router = express.Router();

// CRUD Routes
router.post('/ccc', createBusSchedule);
router.get('/bus-schedules', getAllBusSchedules);
router.get('/bus-schedule/:id', getBusScheduleByID);
router.put('/bus-schedule/:id', updateBusSchedule);
router.delete('/bus-schedule/:id', deleteBusSchedule);

export default router;
