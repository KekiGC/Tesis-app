import { Router } from 'express';
const router = Router();

import { getPatients, getPatient, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';

router.get('/patients/:doctorId', getPatients);
router.get('/patient/:id', getPatient);
router.post('/patients', createPatient);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

export default router;