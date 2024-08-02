import { Request, Response } from 'express';
import MedicalRecord, { IMedicalRecord } from '../models/medicalRecord';

// obtener las historias clinicas de un paciente por su id
export const getMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const medicalRecords = await MedicalRecord.find({ patientId: id });
    return res.status(200).json(medicalRecords);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener una historia clinica por su id
// export const getMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
//   const { id } = req.params;

//   if (!id) {
//     return res.status(400).json({ msg: 'Please provide an id' });
//   }

//   try {
//     const medicalRecord = await MedicalRecord.findById(id);

//     if (!medicalRecord) {
//       return res.status(404).json({ msg: 'Medical record not found' });
//     }

//     return res.status(200).json(medicalRecord);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: 'Internal server error' });
//   }
// };

// crear una historia clinica de un paciente
export const createMedicalRecord = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, observaciones, ant_medicos, ant_familiares, ant_laborales, alergias, vacunas, medicamentos, enf_cronicas, empresa, grupoSanguineo, habits, treatment } = req.body;

  try {
    if (!patientId) {
      return res.status(400).json({ msg: 'Please provide the patient id' });
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