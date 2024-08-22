import { Router } from 'express';
import { getAppointment, getDoctorAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointment.controller';

const router = Router();

router.post('/appointments', createAppointment);
router.get('/appointments/:doctorId', getDoctorAppointments);
router.get('/appointment/:id', getAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

export default router;