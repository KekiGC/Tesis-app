"use strict";
// server/src/controllers/pdfcreator.controller.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfcreatorController = void 0;
const pdfGenerator_1 = require("../helpers/pdfGenerator");
const createMedicalRestPDF = (req, res) => {
    const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final } = req.body;
    try {
        const pdfData = {
            patientId: String(patientId), // Convertimos a string
            nombre_paciente,
            cedula_paciente,
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio,
            fecha_final
        };
        const pdfBuffer = (0, pdfGenerator_1.generarPDF)(pdfData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=medicalRest.pdf');
        res.send(pdfBuffer);
    }
    catch (error) {
        res.status(500).send({ message: 'Error generating PDF', error });
    }
};
exports.PdfcreatorController = {
    createMedicalRestPDF
};
