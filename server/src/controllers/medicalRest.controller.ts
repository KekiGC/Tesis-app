import { Request, Response } from 'express';
import MedicalRest from '../models/medicalRest';
import Patient from '../models/patient'; 
import User from '../models/user';
import UserInfo from '../models/userInfo';
import { generarPDF, DatosMedicos } from '../services/pdf.service'; 


// Crear un nuevo reporte médico
export const createMedicalRest = async (req: Request, res: Response): Promise<Response> => {
    const { doctorId, cedulaPaciente, sintomas, fecha, diagnostico, fecha_inicio, fecha_final, comentarios } = req.body;

    if (!cedulaPaciente || !sintomas || !fecha || !diagnostico || !fecha_inicio || !fecha_final || !comentarios || !doctorId) {
        return res.status(400).json({ msg: 'Please provide all fields' });
    }

    try {
        // Buscar el paciente por cédula
        const patient = await Patient.findOne({ cedula: cedulaPaciente });

        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        const user = await User.findById(doctorId);
        if (!user) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        const userInfo = await UserInfo.findOne({ user: doctorId });
        if (!userInfo) {
            return res.status(404).json({ msg: 'Doctor info not found' });
        }

        // Crear y guardar el nuevo reporte médico
        const newMedicalRest = new MedicalRest({
            doctorId,
            patientId: patient._id,  // Usa el _id del paciente encontrado
            sintomas,
            fecha,
            diagnostico,
            fecha_inicio,
            fecha_final,
            comentarios,
        });

        const savedMedicalRest = await newMedicalRest.save();

        // Preparar los datos para el PDF
        const pdfData: DatosMedicos = {
            nombrePaciente: `${patient.name} ${patient.lastname}`,
            cedulaPaciente: patient.cedula,
            nombreDoctor: `${user.name} ${user.lastname}`,
            correoDoctor: user.email,
            direccionDoctor: userInfo.direccion,
            telefonoDoctor: userInfo.telefono,
            especialidadDoctor: userInfo.especialidad,
            inscripcionCMDoctor: userInfo.inscripcionCM,
            registroDoctor: userInfo.registro,
            firmaDoctor: userInfo.firma,
            sintomas: savedMedicalRest.sintomas,
            diagnostico: savedMedicalRest.diagnostico,
            fecha: new Date(savedMedicalRest.fecha),
            fechaInicio: new Date(savedMedicalRest.fecha_inicio),
            fechaFinal: new Date(savedMedicalRest.fecha_final),
            comentarios: savedMedicalRest.comentarios,
        };

        // Generar el PDF
        const pdfBuffer = await generarPDF(pdfData);

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Reposo_medico_${patient.name}_${patient.lastname}.pdf`)
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

export const getAllMedicalRests = async (req: Request, res: Response): Promise<Response> => {
    const { doctorId } = req.params;
    try {
        // Obtener todos los reportes médicos
        const medicalRests = await MedicalRest.find({ doctorId });

        // Si no hay reportes médicos, retornar un error
        if (medicalRests.length === 0) {
            return res.status(404).json({ msg: 'No medical reports found' });
        }

        // Mapeo para reemplazar el patientId con los datos del paciente
        const medicalRestsWithPatientData = await Promise.all(
            medicalRests.map(async (medicalRest) => {
                const patient = await Patient.findById(medicalRest.patientId);

                return {
                    ...medicalRest.toObject(),
                    nombrePaciente: patient ? `${patient.name} ${patient.lastname}` : 'Desconocido',
                    cedulaPaciente: patient ? patient.cedula : 'N/A',
                };
            })
        );

        // Enviar los datos en formato JSON
        return res.status(200).json(medicalRestsWithPatientData);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

export const getMedicalRestById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        // Buscar el reporte médico por ID
        const medicalRest = await MedicalRest.findById(id);
        if (!medicalRest) {
            return res.status(404).json({ msg: 'Medical rest not found' });
        }

        // Buscar el paciente por ID
        const patient = await Patient.findById(medicalRest.patientId);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        // Buscar el doctor por ID
        const user = await User.findById(medicalRest.doctorId);
        if (!user) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        // Buscar la información del doctor por ID
        const userInfo = await UserInfo.findOne({ user: medicalRest.doctorId });
        if (!userInfo) {
            return res.status(404).json({ msg: 'Doctor info not found' });
        }

        // Preparar los datos para el PDF
        const pdfData: DatosMedicos = {
            nombrePaciente: `${patient.name} ${patient.lastname}`,
            cedulaPaciente: patient.cedula,
            nombreDoctor: `${user.name} ${user.lastname}`,
            correoDoctor: user.email,
            direccionDoctor: userInfo.direccion,
            telefonoDoctor: userInfo.telefono,
            especialidadDoctor: userInfo.especialidad,
            inscripcionCMDoctor: userInfo.inscripcionCM,
            registroDoctor: userInfo.registro,
            firmaDoctor: userInfo.firma,
            sintomas: medicalRest.sintomas,
            diagnostico: medicalRest.diagnostico,
            fecha: new Date(medicalRest.fecha),
            fechaInicio: new Date(medicalRest.fecha_inicio),
            fechaFinal: new Date(medicalRest.fecha_final),
            comentarios: medicalRest.comentarios,
        };

        // Generar el PDF
        const pdfBuffer = await generarPDF(pdfData);

        // Enviar el PDF como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Reposo_medico_${patient.name}_${patient.lastname}.pdf`)
        return res.send(pdfBuffer);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};


// Eliminar un reporte médico por ID
export const deleteMedicalRest = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const deletedMedicalRest = await MedicalRest.findByIdAndDelete(id);
        if (!deletedMedicalRest) {
            return res.status(404).json({ msg: 'Medical rest not found' });
        }
        return res.status(200).json({ msg: 'Medical rest deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};
