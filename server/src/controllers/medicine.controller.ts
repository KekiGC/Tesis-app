import { Request, Response } from 'express';
import Medicine from '../models/medicine';

// Crear un nuevo medicamento
export const createMedicine = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, type, use } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!name || !type || !use) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newMedicine = new Medicine({
      name,
      type,
      use,
    });

    await newMedicine.save();

    return res.status(201).json(newMedicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener medicamentos
export const getMedicines = async (req: Request, res: Response): Promise<Response> => {
  try {
    const medicines = await Medicine.find();

    return res.status(200).json(medicines);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// editar un medicamento
export const updateMedicine = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { name, type, use } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!name || !type || !use) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, { name, type, use }, { new: true });

    if (!updatedMedicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }

    return res.status(200).json(updatedMedicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// eliminar un medicamento
export const deleteMedicine = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;

    const deletedMedicine = await Medicine.findByIdAndDelete(id);

    if (!deletedMedicine) {
      return res.status(404).json({ msg: 'Medicine not found' });
    }

    return res.status(200).json(deletedMedicine);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};