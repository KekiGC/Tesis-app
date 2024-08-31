import { Router } from 'express';
const router = Router();

import { getMedicalRecord, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord, getAllMedicalRecords } from '../controllers/medicalRecord.controller';

router.get('/medicalRecord/:patientId', getMedicalRecord);
router.get('/medicalRecords/:doctorId', getAllMedicalRecords)
router.post('/medicalRecord', createMedicalRecord);
router.put('/medicalRecord/:id', updateMedicalRecord);
router.delete('/medicalRecord/:id', deleteMedicalRecord);

export default router;