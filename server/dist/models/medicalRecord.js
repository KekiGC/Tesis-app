"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const habitsSchema = new mongoose_1.Schema({
    alcohol: { type: String, required: true },
    estupefacientes: { type: String, required: true },
    actividad_fisica: { type: String, required: true },
    tabaco: { type: String, required: true },
    cafe: { type: String, required: true },
    sueño: { type: String, required: true },
    alimentacion: { type: String, required: true },
    sexuales: { type: String, required: true },
});
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
    ant_medicos: {
        type: String,
        required: false,
        trim: true,
    },
    ant_familiares: {
        type: String,
        required: false,
        trim: true,
    },
    ant_laborales: {
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
    habits: {
        type: habitsSchema,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)('MedicalRecord', medicalRecordSchema);
