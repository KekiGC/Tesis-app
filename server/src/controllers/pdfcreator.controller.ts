import { Request, Response } from 'express';
import MedicalRest, { IMedicalRest } from '../models/medicalRest';
import { createMedicalRestPDF, IMedicalRestPDFData } from '../helpers/pdfGenerator';

export const createMedicalRest = async (req: Request, res: Response): Promise<Response> => {
    const { patientId, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios } = req.body;

    if (!patientId || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final || !comentarios) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    try {
        const newMedicalRest: IMedicalRest = new MedicalRest({
            patientId,
            sintomas,
            fecha, // Dejar fecha como cadena
            diagnostico,
            fecha_inicio, // Dejar fecha_inicio como cadena
            fecha_final, // Dejar fecha_final como cadena
            comentarios,
        });

        const savedMedicalRest: IMedicalRest = await newMedicalRest.save();

        // Convertir las fechas a cadenas
        const pdfData: IMedicalRestPDFData = {
            patientId: String(savedMedicalRest.patientId),
            sintomas: savedMedicalRest.sintomas,
            fecha: savedMedicalRest.fecha, // Mantener como cadena
            diagnostico: savedMedicalRest.diagnostico,
            fecha_inicio: savedMedicalRest.fecha_inicio, // Mantener como cadena
            fecha_final: savedMedicalRest.fecha_final, // Mantener como cadena
            comentarios : savedMedicalRest.comentarios,
        };

        // Generar el PDF
        const pdfBuffer = createMedicalRestPDF(pdfData);

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);

        // Retornar la respuesta JSON con los datos guardados
        return res.status(201).json(savedMedicalRest);
    } catch (err) {
        if ((err as any).name === 'ValidationError') {
            const validationErrors = Object.values((err as any).errors).map((e: any) => e.message);
            return res.status(400).json({ msg: 'Validation error', errors: validationErrors });
        } else if ((err as any).code === 11000) {
            return res.status(400).json({ msg: 'Duplicate key error' });
        } else {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    }
};
