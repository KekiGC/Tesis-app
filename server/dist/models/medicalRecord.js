"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const medicalRecordSchema = new mongoose_1.Schema({
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    observaciones: {
        type: String,
        required: false,
        trim: true,
    },
    ant_personales: {
        type: String,
        required: false,
        trim: true,
    },
    ant_familiares: {
        type: String,
        required: false,
        trim: true,
    },
    alergias: {
        type: String,
        required: false,
        trim: true,
    },
    vacunas: {
        type: String,
        required: false,
        trim: true,
    },
    medicamentos: {
        type: String,
        required: false,
        trim: true,
    },
    enf_cronicas: {
        type: String,
        required: false,
        trim: true,
    },
});
exports.default = (0, mongoose_1.model)('MedicalRecord', medicalRecordSchema);
