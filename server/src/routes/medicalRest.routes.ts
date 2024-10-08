import express, { Router } from 'express';
import { 
    createMedicalRest, 
    getAllMedicalRests,
    getMedicalRestById,
    deleteMedicalRest, 
} from '../controllers/medicalRest.controller';

const router: Router = express.Router();

// Ruta para crear un nuevo reporte médico
router.post('/create-medical-rest', createMedicalRest);

// Ruta para obtener todos los reportes médicos
router.get('/getall-medical-rest/:doctorId', getAllMedicalRests);

// Ruta para obtener un reporte médico por su ID
router.get('/get-medical-rest/:id', getMedicalRestById);

// Ruta para eliminar un reporte médico
router.delete('/delete-medical-rest/:id', deleteMedicalRest);


export default router;
