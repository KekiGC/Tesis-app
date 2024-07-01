// routes/medicalReportRoutes.js

import express, { Router } from 'express';
import { createMedicalRest, getAllMedicalRests, getMedicalRestById, updateMedicalRest, deleteMedicalRest, getMedicalReportsByPatientId }
from '../controllers/medicalRest.controller';

const router: Router = express.Router();

// Ruta para crear un nuevo reporte médico
router.post('/create-medical-rest', createMedicalRest); //

// Ruta para obtener todos los reportes médicos
router.get('/getall-medical-rest', getAllMedicalRests); //

// Ruta para obtener un reporte médico por su ID
router.get('/get-medical-rest/:id', getMedicalRestById); //

// Ruta para obtener todos los reportes médicos de un paciente
router.get('/get-medical-rest-by-patientid/:patientId', getMedicalReportsByPatientId); //

// Ruta para actualizar un reporte médico existente
router.put('/update-medical-rest', updateMedicalRest); //

// Ruta para eliminar un reporte médico
router.delete('/delete-medical-rest/:id', deleteMedicalRest); //

export default router;