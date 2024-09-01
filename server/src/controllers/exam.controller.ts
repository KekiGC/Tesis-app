import { Request, Response } from 'express';
import Exam, { IExam } from '../models/exam';

// Crear un nuevo examen físico
export const createExam = async (req: Request, res: Response): Promise<Response> => {
    try {
        const exam = new Exam(req.body);
        await exam.save();
        return res.status(201).json(exam);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Obtener todos los exámenes físicos de un doctor
export const getExams = async (req: Request, res: Response): Promise<Response> => {
    const { doctorId } = req.params;
    if (!doctorId) {
        return res.status(400).json({ msg: 'Please provide a doctor id' });
    }
    try {
        const exams = await Exam.find({ doctorId }).populate('patientId', 'name lastname cedula');
        return res.status(200).json(exams);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Obtener un examen físico específico por su ID
export const getExamById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const exam = await Exam.findById(id).populate('patientId', 'name lastname cedula');
        if (!exam) {
            return res.status(404).json({ msg: 'Exam not found' });
        }
        return res.status(200).json(exam);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Actualizar un examen físico
export const updateExam = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const updatedExam = await Exam.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedExam) {
            return res.status(404).json({ msg: 'Exam not found' });
        }
        return res.status(200).json(updatedExam);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

// Eliminar un examen físico
export const deleteExam = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const deletedExam = await Exam.findByIdAndDelete(id);
        if (!deletedExam) {
            return res.status(404).json({ msg: 'Exam not found' });
        }
        return res.status(200).json({ msg: 'Exam deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};