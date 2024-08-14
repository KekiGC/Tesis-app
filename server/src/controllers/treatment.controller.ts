import { Request, Response } from 'express';
import Treatment from '../models/treatment';

export const createTreatment = async (req: Request, res: Response): Promise<Response> => {
    const { medicines, description, dose, duration } = req.body;
    try {
        if (!description || !dose || !duration) {
            return res.status(400).json({ msg: 'Please provide all fields' });
        }

        const newTreatment = new Treatment(req.body);
        const savedTreatment = await newTreatment.save();

        return res.status(201).json(savedTreatment);
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

export const getTreatments = async (req: Request, res: Response): Promise<Response> => {
    try {
        const treatments = await Treatment.find();
        return res.status(200).json(treatments);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// crear una medicina
export const createMedicine = async (req: Request, res: Response): Promise<Response> => {
    const { name, type, use } = req.body;
    try {
        if (!name || !type || !use) {
            return res.status(400).json({ msg: 'Please provide all fields' });
        }

        const newMedicine = new Treatment(req.body);
        const savedMedicine = await newMedicine.save();

        return res.status(201).json(savedMedicine);
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

// obtener medicinas
export const getMedicines = async (req: Request, res: Response): Promise<Response> => {
    try {
        const medicines = await Treatment.find();
        return res.status(200).json(medicines);
    } catch (error) {
        return res.status(500).json(error);
    }
};