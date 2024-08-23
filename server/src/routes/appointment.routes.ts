import { Router } from 'express';
import { getAppointment, getDoctorAppointments, createAppointment, updateAppointment, deleteAppointment, 
    getFilteredAppointments, getImminentAppointments } from '../controllers/appointment.controller';

const router = Router();

router.post('/appointments', createAppointment);

router.get('/appointments/:doctorId', getDoctorAppointments);
// devuelve las citas de un doctor en los próximos 7 días
router.get('/appointments/:doctorId/imminent', getImminentAppointments);
// devuelve las citas de un doctor filtradas por hora de inicio, hora de fin y nombre del paciente
router.get('/appointments/:doctorId/filtered', getFilteredAppointments);
router.get('/appointment/:id', getAppointment);

router.put('/appointments/:id', updateAppointment);

router.delete('/appointments/:id', deleteAppointment);

export default router;