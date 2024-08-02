import { Request, Response } from 'express';
import aptitudeProof, {  IAptitudeProof } from '../models/aptitudeProof';

// obtener las pruebas de aptitud
export const getAptitudeProof = async (req: Request, res: Response): Promise<Response> => {
  try {
    const aptitudeProofs = await aptitudeProof.find();
    return res.status(200).json(aptitudeProofs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener una prueba de aptitud por su id
export const getAptitudeProofById = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const getAptProof = await aptitudeProof.findById(id);

    if (!getAptProof) {
      return res.status(404).json({ msg: 'Aptitude proof not found' });
    }

    return res.status(200).json(getAptProof);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// crear una prueba de aptitud
export const createAptitudeProof = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, doctorId, concepto, clasificacion } = req.body;

  try {
    if (!patientId || !doctorId || !concepto || !clasificacion) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    const newAptitudeProof: IAptitudeProof = new aptitudeProof(req.body);
    const savedAptitudeProof = await newAptitudeProof.save();
    return res.status(201).json(savedAptitudeProof);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// eliminar una prueba de aptitud
export const deleteAptitudeProof = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const deletedAptProof = await aptitudeProof.findByIdAndDelete(id);

    if (!deletedAptProof) {
      return res.status(404).json({ msg: 'Aptitude proof not found' });
    }

    return res.status(200).json({ msg: 'Aptitude proof deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};