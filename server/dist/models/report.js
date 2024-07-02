"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reportSchema = new mongoose_1.Schema({
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    doctorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    cedula: {
        type: String,
        required: true,
        trim: true,
    },
    fecha_reporte: {
        type: Date,
        required: true,
    },
    sintomas: {
        type: String,
        required: true,
        trim: true,
    },
    hallazgos: {
        type: String,
        required: true,
        trim: true,
    },
    examenes: {
        type: String,
        required: true,
        trim: true,
    },
    diagnostico: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)('Report', reportSchema);
