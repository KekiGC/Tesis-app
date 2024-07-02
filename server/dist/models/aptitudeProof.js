"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const aptitudeProofSchema = new mongoose_1.Schema({
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
    concepto: {
        type: String,
        enum: ['preempleo', 'prevacacional', 'postvacacional', 'retiro'],
        required: true,
        trim: true,
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
    edad: {
        type: Number,
        required: true,
    },
    empresa: {
        type: String,
        required: true,
        trim: true,
    },
    cargo: {
        type: String,
        required: true,
        trim: true,
    },
    clasificacion: {
        type: String,
        enum: ['apto', 'no apto'],
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)('AptitudeProof', aptitudeProofSchema);
