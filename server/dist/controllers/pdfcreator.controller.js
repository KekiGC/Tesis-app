"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMedicalRest = void 0;
const medicalRest_1 = __importDefault(require("../models/medicalRest"));
const pdfGenerator_1 = require("../helpers/pdfGenerator");
const createMedicalRest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios } = req.body;
    if (!patientId || !nombre_paciente || !cedula_paciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final || !comentarios) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }
    try {
        const newMedicalRest = new medicalRest_1.default({
            patientId,
            nombre_paciente,
            cedula_paciente,
            sintomas,
            fecha, // Dejar fecha como cadena
            diagnostico,
            fecha_inicio, // Dejar fecha_inicio como cadena
            fecha_final, // Dejar fecha_final como cadena
            comentarios,
        });
        const savedMedicalRest = yield newMedicalRest.save();
        // Convertir las fechas a cadenas
        const pdfData = {
            patientId: String(savedMedicalRest.patientId),
            nombre_paciente: savedMedicalRest.nombre_paciente,
            cedula_paciente: savedMedicalRest.cedula_paciente,
            sintomas: savedMedicalRest.sintomas,
            fecha: savedMedicalRest.fecha, // Mantener como cadena
            diagnostico: savedMedicalRest.diagnostico,
            fecha_inicio: savedMedicalRest.fecha_inicio, // Mantener como cadena
            fecha_final: savedMedicalRest.fecha_final, // Mantener como cadena
            comentarios: savedMedicalRest.comentarios,
        };
        // Generar el PDF
        const pdfBuffer = (0, pdfGenerator_1.createMedicalRestPDF)(pdfData);
        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
        // Retornar la respuesta JSON con los datos guardados
        return res.status(201).json(savedMedicalRest);
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ msg: 'Validation error', errors: validationErrors });
        }
        else if (err.code === 11000) {
            return res.status(400).json({ msg: 'Duplicate key error' });
        }
        else {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
});
exports.createMedicalRest = createMedicalRest;

