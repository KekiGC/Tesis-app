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

exports.createMedicalRestPDFRoute = exports.deleteMedicalRest = exports.updateMedicalRest = exports.getMedicalReportsByPatientId = exports.getMedicalRestById = exports.getAllMedicalRests = exports.createMedicalRest = void 0;
const mongoose_1 = require("mongoose");
const medicalRest_1 = __importDefault(require("../models/medicalRest"));
const pdfGenerator_1 = require("../helpers/pdfGenerator");
// crear un nuevo reporte médico
const createMedicalRest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios = '' } = req.body;
    if (!patientId || !nombre_paciente || !cedula_paciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final) {
        return res.status(400).json({ msg: 'Please provide all required fields' });

    }
    try {
        const newMedicalRest = new medicalRest_1.default({
            patientId,

            nombre_paciente,
            cedula_paciente,
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio,
            fecha_final,
            comentarios,

        });
        const savedMedicalRest = yield newMedicalRest.save();
        return res.status(201).json(savedMedicalRest);
    }

    catch (err) {
        if (err.name === 'ValidationError') {
            const validationErrors = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ msg: 'Validation error', errors: validationErrors });
        }
        else if (err.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ msg: 'Duplicate key error' });
        }
        else {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
});
exports.createMedicalRest = createMedicalRest;
// obtener todos los reportes médicos
const getAllMedicalRests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicalRests = yield medicalRest_1.default.find();
        return res.status(200).json(medicalRests);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getAllMedicalRests = getAllMedicalRests;
// obtener un reporte médico por ID
const getMedicalRestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const medicalRest = yield medicalRest_1.default.findById(id);
        if (!medicalRest) {
            return res.status(404).json({ msg: 'Medical report not found' });
        }
        return res.status(200).json(medicalRest);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.getMedicalRestById = getMedicalRestById;
// obtener reportes médicos por ID de paciente
const getMedicalReportsByPatientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        const medicalReports = yield medicalRest_1.default.find({ patientId });
        res.json(medicalReports);
    }
    catch (error) {
        if (error instanceof mongoose_1.Error) {
            console.error('Error fetching medical reports:', error.message);
            return res.status(500).json({ message: 'Error fetching medical reports' });
        }
        else {
            console.error('Unexpected error:', error);
            return res.status(500).json({ message: 'Unexpected error' });
        }
    }
});
exports.getMedicalReportsByPatientId = getMedicalReportsByPatientId;
// actualizar un reporte médico
const updateMedicalRest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios } = req.body;
        // Validar que se haya enviado un ID válido
        if (!id) {
            return res.status(400).json({ error: 'ID del registro médico es requerido' });
        }
        // Buscar el registro médico a actualizar
        const medicalRest = yield medicalRest_1.default.findById(id);
        if (!medicalRest) {
            return res.status(404).json({ error: 'Registro médico no encontrado' });
        }
        // Actualizar los campos del registro
        medicalRest.patientId = patientId;
        medicalRest.nombre_paciente = nombre_paciente;
        medicalRest.cedula_paciente = cedula_paciente;
        medicalRest.sintomas = sintomas;
        medicalRest.fecha = fecha;
        medicalRest.diagnostico = diagnostico;
        medicalRest.fecha_inicio = fecha_inicio;
        medicalRest.fecha_final = fecha_final;
        medicalRest.comentarios = comentarios;
        // Guardar los cambios en la base de datos
        yield medicalRest.save();
        return res.status(200).json(medicalRest);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al actualizar el registro médico' });
    }
});
exports.updateMedicalRest = updateMedicalRest;
// eliminar un reporte médico
const deleteMedicalRest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const medicalRest = yield medicalRest_1.default.findByIdAndDelete(id);
        if (!medicalRest) {
            return res.status(404).json({ msg: 'Medical report not found' });
        }
        return res.status(200).json({ msg: 'Medical report deleted' });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});
exports.deleteMedicalRest = deleteMedicalRest;
//crar pdf de medical rest
const createMedicalRestPDFRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios = '' } = req.body;
    if (!patientId || !nombre_paciente || !cedula_paciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final) {
        res.status(400).json({ msg: 'Please provide all required fields' });
        return;
    }
    try {
        const pdfData = {
            patientId: String(patientId),
            nombre_paciente,
            cedula_paciente,
            sintomas,
            fecha: fecha.toString(), // Convertir fecha a string
            diagnostico,
            fecha_inicio: fecha_inicio.toString(), // Convertir fecha_inicio a string
            fecha_final: fecha_final.toString(), // Convertir fecha_final a string
            comentarios: comentarios || '',
        };
        const pdfBuffer = (0, pdfGenerator_1.createMedicalRestPDF)(pdfData);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error generating PDF' });
    }
});
exports.createMedicalRestPDFRoute = createMedicalRestPDFRoute;

