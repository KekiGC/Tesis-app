import { Request, Response } from 'express';
import ExternalExam from '../models/externalExam';
import MedicalRecord from '../models/medicalRecord';
import { uploadImage } from '../services/uploadFile.service';

// Crear un nuevo examen externo
export const createExternalExam = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { medicalRecord, type, description, date, path } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!medicalRecord || !type || !date || !path) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newExam = new ExternalExam({
      medicalRecord,
      type,
      description,
      date,
      path,
    });

    if (req.file) {
      const file = req.file as Express.Multer.File;
      newExam.path = await uploadImage(file, 'externalExams');
    }

    await newExam.save();

    return res.status(201).json(newExam);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// Obtener un examen externo por ID
export const getExternalExam = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const exam = await ExternalExam.findById(id).populate('medicalRecord');

    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    return res.status(200).json(exam);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// Actualizar un examen externo
export const updateExternalExam = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const updatedExam = await ExternalExam.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedExam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    return res.status(200).json(updatedExam);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// Eliminar un examen externo
export const deleteExternalExam = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deletedExam = await ExternalExam.findByIdAndDelete(id);

    if (!deletedExam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    return res.status(200).json({ msg: 'Exam deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};