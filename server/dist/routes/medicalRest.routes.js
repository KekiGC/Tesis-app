"use strict";

// routes/medicalReportRoutes.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const medicalRest_controller_1 = require("../controllers/medicalRest.controller");
const router = express_1.default.Router();
// Ruta para crear un nuevo reporte médico
router.post('/create-medical-rest', medicalRest_controller_1.createMedicalRest); //
// Ruta para obtener todos los reportes médicos
router.get('/getall-medical-rest', medicalRest_controller_1.getAllMedicalRests); //
// Ruta para obtener un reporte médico por su ID
router.get('/get-medical-rest/:id', medicalRest_controller_1.getMedicalRestById); //
// Ruta para obtener todos los reportes médicos de un paciente
router.get('/get-medical-rest-by-patientid/:patientId', medicalRest_controller_1.getMedicalReportsByPatientId); //
// Ruta para actualizar un reporte médico existente
router.put('/update-medical-rest', medicalRest_controller_1.updateMedicalRest); //
// Ruta para eliminar un reporte médico
router.delete('/delete-medical-rest/:id', medicalRest_controller_1.deleteMedicalRest); //
// Ruta para generar un PDF basado en datos de medical rest
router.post('/create-medical-rest-pdf', medicalRest_controller_1.createMedicalRestPDFRoute); //
exports.default = router;

