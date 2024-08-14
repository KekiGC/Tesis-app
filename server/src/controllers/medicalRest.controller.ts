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
        const newMedicalRest = new MedicalRest({
            patientId,
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio,
            fecha_final,
            comentarios,
        });

        const savedMedicalRest = await newMedicalRest.save();

        // Buscar el paciente por ID
        const patient = await Patient.findById(patientId);

        // Preparar los datos para el PDF
        const pdfData: DatosMedicos = {
            nombrePaciente: patient ? `${patient.name} ${patient.lastname}` : 'Desconocido',
            cedulaPaciente: patient ? patient.cedula : 'N/A',
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
        return res.send(pdfBuffer);

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

export const getAllMedicalRests = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Obtener todos los reportes médicos
        const medicalRests = await MedicalRest.find();

        // Si no hay reportes médicos, retornar un error
        if (medicalRests.length === 0) {
            return res.status(404).json({ msg: 'No medical reports found' });
        }

        // Mapeo para reemplazar el patientId con los datos del paciente
        const medicalRestsWithPatientData = await Promise.all(
            medicalRests.map(async (medicalRest) => {
                const patient = await Patient.findById(medicalRest.patientId);

                return {
                    ...medicalRest.toObject(),
                    nombrePaciente: patient ? `${patient.name} ${patient.lastname}` : 'Desconocido',
                    cedulaPaciente: patient ? patient.cedula : 'N/A',
                };
            })
        );

        // Enviar los datos en formato JSON
        return res.status(200).json(medicalRestsWithPatientData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

 

export const getMedicalRestById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        // Buscar el reporte médico por ID
        const medicalRest = await MedicalRest.findById(id);
        if (!medicalRest) {
            return res.status(404).json({ msg: 'Medical rest not found' });
        }

        // Buscar el paciente por ID
        const patient = await Patient.findById(medicalRest.patientId);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        // Preparar los datos para el PDF
        const pdfData: DatosMedicos = {
            nombrePaciente: `${patient.name} ${patient.lastname}`,
            cedulaPaciente: patient.cedula,
            sintomas: medicalRest.sintomas,
            diagnostico: medicalRest.diagnostico,
            fecha: new Date(medicalRest.fecha),
            fechaInicio: new Date(medicalRest.fecha_inicio),
            fechaFinal: new Date(medicalRest.fecha_final),
        };

        // Generar el PDF
        const pdfBuffer = generarPDF(pdfData);

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        return res.send(pdfBuffer);

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
