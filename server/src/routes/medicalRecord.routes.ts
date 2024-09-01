import { Router } from 'express';
const router = Router();

import { getMedicalRecord, createMedicalRecord, updateMedicalRecord, deleteMedicalRecord, getAllMedicalRecords } from '../controllers/medicalRecord.controller';

// obtiene el historial clinico de un paciente por su id
router.get('/medicalRecord/:patientId', getMedicalRecord);
// obtiene todas las historias clinicas de un doctor (usuario)
router.get('/medicalRecords/:doctorId', getAllMedicalRecords)
router.post('/medicalRecord', createMedicalRecord);
router.put('/medicalRecord/:id', updateMedicalRecord);
router.delete('/medicalRecord/:id', deleteMedicalRecord);

export default router;