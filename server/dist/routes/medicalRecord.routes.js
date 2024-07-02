"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const medicalRecord_controller_1 = require("../controllers/medicalRecord.controller");

router.get('/medicalRecord/:id', medicalRecord_controller_1.getMedicalRecord);
router.post('/medicalRecord', medicalRecord_controller_1.createMedicalRecord);
router.put('/medicalRecord/:id', medicalRecord_controller_1.updateMedicalRecord);
router.delete('/medicalRecord/:id', medicalRecord_controller_1.deleteMedicalRecord);
exports.default = router;
