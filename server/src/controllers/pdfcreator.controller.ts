// server/src/controllers/pdfcreator.controller.ts

import { Request, Response } from 'express';
import { generarPDF, IMedicalRestPDFData } from '../helpers/pdfGenerator';
import { IMedicalRest } from '../models/medicalRest';

const createMedicalRestPDF = (req: Request, res: Response): void => {
    const {
        patientId,
        nombre_paciente,
        cedula_paciente,
        sintomas,
        fecha,
        diagnostico,
        fecha_inicio,
        fecha_final
    }: IMedicalRest = req.body;

    try {
        const pdfData: IMedicalRestPDFData = {
            patientId: String(patientId),  // Convertimos a string
            nombre_paciente,
            cedula_paciente,
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio,
            fecha_final
        };

        const pdfBuffer = generarPDF(pdfData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=medicalRest.pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).send({ message: 'Error generating PDF', error });
    }
};

export const PdfcreatorController = {
    createMedicalRestPDF
};
