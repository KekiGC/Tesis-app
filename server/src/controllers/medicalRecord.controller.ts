import { Request, Response } from 'express';
import MedicalRecord, { IMedicalRecord } from '../models/medicalRecord';

// obtener las historias clinicas de un paciente por su id
export const getMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ msg: 'Please provide the patient id' });
  }

  try {
    const medicalRecords = await MedicalRecord.find({ patientId: patientId }).populate('treatment').populate('externalExams').exec();
    return res.status(200).json(medicalRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener todas las historias de un doctor
export const getAllMedicalRecords = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ msg: 'Please provide the doctor id' });
  }

  try {
    const medicalRecords = await MedicalRecord.find({ doctorId: doctorId }).populate('patientId').exec();
    return res.status(200).json(medicalRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// crear una historia clinica de un paciente
export const createMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, doctorId, observaciones, ant_medicos, ant_familiares, ant_laborales, alergias, vacunas, enf_cronicas, habits, treatment, externalExams } = req.body;

  try {
    if (!patientId || !doctorId) {
      return res.status(400).json({ msg: 'Please provide the patient and doctor id' });
    }

    const newMedicalRecord: IMedicalRecord = new MedicalRecord(req.body);
    const savedMedicalRecord = await newMedicalRecord.save();
    return res.status(201).json(savedMedicalRecord);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const updateMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updatedMedicalHistory = await MedicalRecord.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMedicalHistory) {
            return res.status(404).json({ error: 'Medical Record not found' });
        }
        return res.status(200).json(updatedMedicalHistory);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating the medical record' });
    }
};

export const deleteMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedMedicalRecord = await MedicalRecord.findByIdAndDelete(id);
        if (!deletedMedicalRecord) {
            return res.status(404).json({ error: 'Medical Record not found' });
        }
        return res.status(200).json({ msg: 'Medical Record deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting the medical record' });
    }
};