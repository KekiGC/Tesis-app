import { Request, Response } from 'express';
import { DatosInforme, generarPDFInforme } from '../services/pdfReport.service';
import report, { IReport } from '../models/report';
import Patient from '../models/patient';
import User from '../models/user';

export const createReport = async (req: Request, res: Response): Promise<Response> => {
    const { patientId, doctorId, fecha_reporte, sintomas, hallazgos, examenes, diagnostico } = req.body;
    try {
        if (!patientId || !doctorId || !fecha_reporte || !sintomas || !hallazgos || !examenes || !diagnostico) {
            return res.status(400).json({ msg: 'Please provide all fields' });
        }

        const newReport: IReport = new report(req.body);
        const savedReport = await newReport.save();

        const doctor = await User.findById(doctorId);
        if (!doctor) {
            throw new Error("Doctor no encontrado");
        }
        
        const patient = await Patient.findById(patientId);
        if (!patient) {
            throw new Error("Paciente no encontrado");
        }

        const pdfData: DatosInforme = {
            nombrePaciente: `${patient.name} ${patient.lastname}`,
            cedulaPaciente: patient.cedula,
            nombreDoctor: `${doctor.name} ${doctor.lastname}`,
            correoDoctor: doctor.email,
            fechaReporte: new Date(savedReport.fecha_reporte).toLocaleDateString(),
            sintomas: savedReport.sintomas,
            hallazgos: savedReport.hallazgos,
            examenes: savedReport.examenes,
            diagnostico: savedReport.diagnostico,
        };

        const pdfBuffer = generarPDFInforme(pdfData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="informe_medico.pdf"');

        return res.send(pdfBuffer);
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

export const getReports = async (req: Request, res: Response): Promise<Response> => {
    const { doctorId } = req.params;
    if (!doctorId) {
        return res.status(400).json({ msg: 'Please provide a doctor id' });
    }
    try {
        const reports = await report.find({ doctorId });
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