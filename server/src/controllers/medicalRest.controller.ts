import { Request, Response } from 'express';
import { Error } from 'mongoose';
import MedicalRest, { IMedicalRest } from '../models/medicalRest';
import { createMedicalRestPDF, IMedicalRestPDFData } from '../helpers/pdfGenerator';



// crear un nuevo reporte médico
export const createMedicalRest = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios = '' } = req.body;

  if (!patientId || !nombre_paciente || !cedula_paciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
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
      comentarios,
    });

    const savedMedicalRest: IMedicalRest = await newMedicalRest.save();

    return res.status(201).json(savedMedicalRest);
  } catch (err) {
    if ((err as any).name === 'ValidationError') {
      const validationErrors = Object.values((err as any).errors).map((e: any) => e.message);
      return res.status(400).json({ msg: 'Validation error', errors: validationErrors });
    } else if ((err as any).code === 11000) {
      // Duplicate key error
      return res.status(400).json({ msg: 'Duplicate key error' });
    } else {
      console.error(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }
};






// obtener todos los reportes médicos
export const getAllMedicalRests = async (req: Request, res: Response): Promise<Response> => {
  try {
    const medicalRests: IMedicalRest[] = await MedicalRest.find();
    return res.status(200).json(medicalRests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener un reporte médico por ID
export const getMedicalRestById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const medicalRest: IMedicalRest | null = await MedicalRest.findById(id);
    if (!medicalRest) {
      return res.status(404).json({ msg: 'Medical report not found' });
    }
    return res.status(200).json(medicalRest);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener reportes médicos por ID de paciente
export const getMedicalReportsByPatientId = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const medicalReports = await MedicalRest.find({ patientId });
    res.json(medicalReports);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching medical reports:', error.message);
      return res.status(500).json({ message: 'Error fetching medical reports' });
    } else {
      console.error('Unexpected error:', error);
      return res.status(500).json({ message: 'Unexpected error' });
    }
  }
};

// actualizar un reporte médico
export const updateMedicalRest = async (req: Request, res: Response) => {
  try {
    const { id, patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios } = req.body;

    // Validar que se haya enviado un ID válido
    if (!id) {
      return res.status(400).json({ error: 'ID del registro médico es requerido' });
    }

    // Buscar el registro médico a actualizar
    const medicalRest = await MedicalRest.findById(id);
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
    await medicalRest.save();

    return res.status(200).json(medicalRest);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar el registro médico' });
  }
};

// eliminar un reporte médico
export const deleteMedicalRest = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const medicalRest: IMedicalRest | null = await MedicalRest.findByIdAndDelete(id);
    if (!medicalRest) {
      return res.status(404).json({ msg: 'Medical report not found' });
    }
    return res.status(200).json({ msg: 'Medical report deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};


//crar pdf de medical rest



export const createMedicalRestPDFRoute = async (req: Request, res: Response): Promise<void> => {
  const { patientId, nombre_paciente, cedula_paciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios = '' } = req.body;

  if (!patientId || !nombre_paciente || !cedula_paciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final) {
    res.status(400).json({ msg: 'Please provide all required fields' });
    return;
  }

  try {
    const pdfData: IMedicalRestPDFData = {
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

    const pdfBuffer = createMedicalRestPDF(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error generating PDF' });
  }
};