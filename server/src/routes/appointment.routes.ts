import { Router } from 'express';
import { getAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointment.controller';

const router = Router();

router.post('/appointments', createAppointment);
router.get('/appointments/:patientId', getAppointments);
router.get('/appointments/:id', getAppointment);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

export default router;