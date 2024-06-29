"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const router = (0, express_1.Router)();
router.post('/appointments', appointment_controller_1.createAppointment);
router.get('/appointments/:patientId', appointment_controller_1.getAppointments);
router.get('/appointments/:id', appointment_controller_1.getAppointment);
router.put('/appointments/:id', appointment_controller_1.updateAppointment);
router.delete('/appointments/:id', appointment_controller_1.deleteAppointment);
exports.default = router;