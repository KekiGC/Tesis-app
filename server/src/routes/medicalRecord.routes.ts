import { Router } from 'express';
const router = Router();

import { getMedicalRecord, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord } from '../controllers/medicalRecord.controller';

router.get('/medicalRecord/:id', getMedicalRecord);
router.post('/medicalRecord', createMedicalRecord);
router.put('/medicalRecord/:id', updateMedicalRecord);
router.delete('/medicalRecord/:id', deleteMedicalRecord);

export default router;