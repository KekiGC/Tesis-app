import { Request, Response } from 'express';
import Patient, { IPatient } from '../models/patient';
import { uploadImage } from '../services/uploadFile.service';

export const getPatients = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;
  try {
    const patients = await Patient.find({ doctorId: doctorId });
    return res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getPatient = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const patient = await Patient.findById(id);

    if (!patient) {
        return res.status(404).json({ msg: 'Patient not found' });
    }

    return res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const createPatient = async (req: Request, res: Response): Promise<Response> => {
  const { email, name, lastname, doctorId, gender, company, phone, address, birthdate, age, cedula, positionDescription, grupoSanguineo } = req.body;

  try {
      if (!email || !name || !lastname || !doctorId || !gender || !phone || !address || !birthdate || !age || !cedula || !positionDescription) {
        console.log(req.body);
          return res.status(400).json({ msg: 'Please provide all fields' });
      }

      const patient = await Patient.findOne({ email });
      if (patient) {
          return res.status(400).json({ msg: 'Patient already exists' });
      }

      // Create a new patient object and set the position description separately
      const newPatient: IPatient = new Patient({
          email,
          name,
          lastname,
          doctorId,
          gender,
          phone,
          address,
          birthdate,
          age,
          cedula,
          company,
          grupoSanguineo,
          position: {
              description: positionDescription
          }
      });

      if (req.file) {
          const file = req.file as Express.Multer.File;
          newPatient.photo = await uploadImage(file, 'pacientes');
      }

      const savedPatient = await newPatient.save();
      return res.status(201).json(savedPatient);
  } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const updatePatient = async (req: Request, res: Response): Promise<Response> => {
    try {
      let photoUrl = null;
      if (req.file) {
        console.log('Archivo recibido:', req.file.originalname)
        const file = req.file as Express.Multer.File;
        photoUrl = await uploadImage(file, 'pacientes');
        console.log('firma subida a Firebase:', photoUrl);
      } else {
        console.log('No se recibió archivo');
      }

        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, {
            ...req.body,
            photo: photoUrl,
        }, 
        { new: true });

        if (!updatedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        return res.status(200).json(updatedPatient);
    } catch (error) {
        return res.status(500).json({ error: 'Error updating the patient information' });
    }
};

export const deletePatient = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ msg: 'Please provide an id' });
        }
        const deletedPatient = await Patient.findByIdAndDelete(id);
        if (!deletedPatient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        return res.status(200).json(deletedPatient);
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting the patient' });
    }
};