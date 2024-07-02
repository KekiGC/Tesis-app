"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const invoiceSchema = new mongoose_1.Schema({
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
    fecha: {
        type: Date,
        required: true,
    },
    numero_control: {
        type: Number,
        required: true,
        unique: true,
    },
    nombre_razon: {
        type: String,
        required: true,
        trim: true,
    },
    dir_fiscal: {
        type: String,
        required: true,
        trim: true,
    },
    rif: {
        type: String,
        required: true,
        trim: true,
    },
    forma_pago: {
        type: String,
        required: true,
        trim: true,
    },
    contacto: {
        type: String,
        required: true,
        trim: true,
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
    descripcion_servicio: {
        type: String,
        required: true,
        trim: true,
    },
    total: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.default = (0, mongoose_1.model)('Invoice', invoiceSchema);
