import { Request, Response } from 'express';
import MedicalRest, { IMedicalRest } from '../models/medicalRest';
import { createMedicalRestPDF, IMedicalRestPDFData } from '../helpers/pdfGenerator';

export const createMedicalRest = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final } = req.body;

  if (!patientId || !nombre_paciente || !cedula_paciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final) {
    return res.status(400).json({ msg: 'Please provide all fields' });
  }

  try {
    const newMedicalRest: IMedicalRest = new MedicalRest({
      patientId,
      nombre_paciente,
      cedula_paciente,
      sintomas,
      fecha,
      diagnostico,
      fecha_inicio,
      fecha_final,
    });

    const savedMedicalRest: IMedicalRest = await newMedicalRest.save();

    const pdfData: IMedicalRestPDFData = {
      patientId: String(savedMedicalRest.patientId),
      nombre_paciente: savedMedicalRest.nombre_paciente,
      cedula_paciente: savedMedicalRest.cedula_paciente,
      sintomas: savedMedicalRest.sintomas,
      fecha: savedMedicalRest.fecha,
      diagnostico: savedMedicalRest.diagnostico,
      fecha_inicio: savedMedicalRest.fecha_inicio,
      fecha_final: savedMedicalRest.fecha_final,
    };

    const pdfBuffer = createMedicalRestPDF(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

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
