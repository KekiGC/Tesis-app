import { Router } from 'express';
const router = Router();

import { getPatients, getPatient, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';

router.get('/patient/:doctorId', getPatients);
router.get('/patient/:id', getPatient);
router.post('/patient', createPatient);
router.put('/patient/:id', updatePatient);
router.delete('/patient/:id', deletePatient);

export default router;