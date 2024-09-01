import { Router } from 'express';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

import { getPatients, getPatient, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';

router.get('/patients/:doctorId', getPatients);
router.get('/patient/:id', getPatient);
router.post('/patients', upload.single('photo'), createPatient);
router.put('/patients/:id', upload.single('photo'), updatePatient);
router.delete('/patients/:id', deletePatient);

export default router;