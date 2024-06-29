import { Request, Response } from 'express';
import medicalRest, { IMedicalRest } from '../models/medicalRest';

// crear un nuevo reporte medico
export const createMedicalRest = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, name, cedula, sintomas, fecha_reporte, diagnostico, fecha_inicio, fecha_fin } = req.body;

  if (!patientId || !name || !cedula || !sintomas || !fecha_reporte || !diagnostico || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ msg: 'Please provide all fields' });
  }

  try {
    const newMedicalRest: IMedicalRest = new medicalRest({
      patientId,
      name,
      cedula,
      sintomas,
      fecha_reporte,
      diagnostico,
      fecha_inicio,
      fecha_fin,
    });

    const savedMedicalRest = await newMedicalRest.save();
    return res.status(201).json(savedMedicalRest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

