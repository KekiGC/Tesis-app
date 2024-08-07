import { Request, Response } from 'express';
import MedicalRest, { IMedicalRest } from '../models/medicalRest';
import Patient, { IPatient } from '../models/patient'; // Asegúrate de que la ruta sea correcta
import { generarPDF, DatosMedicos } from '../services/pdf.service'; // Asegúrate de que la ruta sea correcta

// Crear un nuevo reporte médico
export const createMedicalRest = async (req: Request, res: Response): Promise<Response> => {
    const { patientId, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios } = req.body;

    if (!patientId || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final || !comentarios) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    try {
        // Crear y guardar el nuevo reporte médico
        const newMedicalRest: IMedicalRest = new MedicalRest({
            patientId,
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio,
            fecha_final,
            comentarios,
        });

        const savedMedicalRest: IMedicalRest = await newMedicalRest.save();

        // Buscar el paciente por ID
        const patient: IPatient | null = await Patient.findById(patientId);

        // Preparar los datos para el PDF
        const pdfData: DatosMedicos = {
            nombrePaciente: patient ? `${patient.name} ${patient.lastname}` : 'Desconocido', // Usa el nombre completo del paciente
            cedulaPaciente: patient ? patient.cedula : 'N/A', // Usa la cédula del paciente
            sintomas: savedMedicalRest.sintomas,
            diagnostico: savedMedicalRest.diagnostico,
            fecha: new Date(savedMedicalRest.fecha),
            fechaInicio: new Date(savedMedicalRest.fecha_inicio),
            fechaFinal: new Date(savedMedicalRest.fecha_final),
        };

        // Generar el PDF
        const pdfBuffer = generarPDF(pdfData);

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

// Obtener todos los reportes médicos
export const getAllMedicalRests = async (req: Request, res: Response): Promise<Response> => {
    try {
        const medicalRests = await MedicalRest.find();
        return res.status(200).json(medicalRests);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Obtener un reporte médico por ID
export const getMedicalRestById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const medicalRest = await MedicalRest.findById(id);
        if (!medicalRest) {
            return res.status(404).json({ msg: 'Medical rest not found' });
        }
        return res.status(200).json(medicalRest);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Actualizar un reporte médico por ID
export const updateMedicalRest = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedMedicalRest = await MedicalRest.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedMedicalRest) {
            return res.status(404).json({ msg: 'Medical rest not found' });
        }
        return res.status(200).json(updatedMedicalRest);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Eliminar un reporte médico por ID
export const deleteMedicalRest = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const deletedMedicalRest = await MedicalRest.findByIdAndDelete(id);
        if (!deletedMedicalRest) {
            return res.status(404).json({ msg: 'Medical rest not found' });
        }
        return res.status(200).json({ msg: 'Medical rest deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};
