import { Request, Response } from 'express';
import Treatment from '../models/treatment';
import Medicine from '../models/medicine';

export const createTreatment = async (req: Request, res: Response): Promise<Response> => {
    const { medicines, description, dose, duration, medicalRecord } = req.body;
    try {
        if (!description || !medicalRecord) {
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
    const { medicalRecordId } = req.params;
    try {
        const treatments = await Treatment.find({ medicalRecord: medicalRecordId }).populate('medicines').exec();
        return res.status(200).json(treatments);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getTreatment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const treatment = await Treatment.findById(id).populate('medicines').exec();
        return res.status(200).json(treatment);
    } catch (error) {
        return res.status(500).json(error);
    }
}

// editar un tratamiento
export const updateTreatment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { medicines, description, dose, duration } = req.body;

        if (!description || !dose || !duration) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        const updatedTreatment = await Treatment.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTreatment) {
            return res.status(404).json({ msg: 'Treatment not found' });
        }

        return res.status(200).json(updatedTreatment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// eliminar tratamiento
export const deleteTreatment = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: 'Please provide an id' });
    }

    try {
        await Treatment.findByIdAndDelete(id);
        return res.status(204).json();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};