import { Request, Response } from 'express';
import report, { IReport } from '../models/report';

export const createReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newReport: IReport = new report(req.body);
        await newReport.save();
        return res.status(201).json(newReport);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getReports = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reports = await report.find();
        return res.status(200).json(reports);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const getReport = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reportFound = await report.findById(req.params.id);
        if (!reportFound) return res.status(404).json({ message: 'Report not found' });
        return res.status(200).json(reportFound);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// eliminar reporte
export const deleteReport = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ msg: 'Please provide an id' });
    }

    try {
        const deletedReport = await report.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(404).json({ msg: 'Report not found' });
        }

        return res.status(200).json({ msg: 'Report deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};