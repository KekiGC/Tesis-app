"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicalRestSchema = new mongoose_1.Schema({
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    nombre_paciente: {
        type: String,
        required: true,
        trim: true,
    },
    cedula_paciente: {
        type: String,
        required: true,
        trim: true,
    },
    sintomas: {
        type: String,
        required: true,
        trim: true,
    },
    fecha: {
        type: Date,
        required: true,
    },
    diagnostico: {
        type: String,
        required: true,
        trim: true,
    },
    fecha_inicio: {
        type: Date,
        required: true,
    },
    fecha_final: {
        type: Date,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('MedicalRest', medicalRestSchema);
