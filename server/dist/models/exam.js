"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VitalSignsSchema = new mongoose_1.Schema({
    FC: { type: Number, required: true },
    TA: { type: String, required: true },
    FR: { type: Number, required: true },
});
const examSchema = new mongoose_1.Schema({
    patientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    impresion_general: {
        type: String,
        required: true,
        trim: true,
    },
    peso: {
        type: Number,
        required: true,
    },
    talla_cms: {
        type: Number,
        required: true,
    },
    piel: {
        type: String,
        required: true,
        trim: true,
    },
    cabeza: {
        type: String,
        required: true,
        trim: true,
    },
    torax_corazon_pulmones: {
        type: String,
        required: true,
        trim: true,
    },
    aparato_respiratorio: {
        type: String,
        required: true,
        trim: true,
    },
    abdomen_pelvis: {
        type: String,
        required: true,
        trim: true,
    },
    genitales: {
        type: String,
        required: true,
        trim: true,
    },
    hernia_umbilical: {
        type: String,
        enum: ['si', 'no'],
        required: true,
        trim: true,
    },
    hernia_inguinal: {
        type: String,
        enum: ['si', 'no'],
        required: true,
        trim: true,
    },
    sist_nervioso: {
        type: String,
        required: true,
        trim: true,
    },
    osteomioarticular: {
        type: String,
        required: true,
        trim: true,
    },
    vitalSigns: {
        type: VitalSignsSchema,
        required: true,
    },

}, {
    timestamps: true,
    versionKey: false,

});
exports.default = (0, mongoose_1.model)('Exam', examSchema);
