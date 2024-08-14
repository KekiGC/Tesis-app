import { Request, Response } from 'express';
import aptitudeProof, {  IAptitudeProof } from '../models/aptitudeProof';
import Patient from '../models/patient';
import { generarPDFConstancia, DatosConstancia } from '../services/pdfApt.service';
import { ICompany } from '../models/company';

// obtener las pruebas de aptitud de un doctor
export const getAptitudeProof = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ msg: 'Please provide a doctor id' });
  }

  try {
    const aptitudeProofs = await aptitudeProof.find({ doctorId });
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
    await newAptitudeProof.save();
    
    const patient = await Patient.findById(patientId).populate('company').exec();
    if (!patient) {
      throw new Error("Paciente no encontrado");
  }

    const company = patient.company as ICompany;

    //preparar los datos para el pdf
    const pdfData: DatosConstancia = {
      nombrePaciente: `${patient.name} ${patient.lastname}`,
      cedulaPaciente: patient.cedula,
      edadPaciente: patient.age,
      fotoPaciente: patient.photo,
      empresa: company.name, 
      cargo: patient.position.description,
      concepto,
      clasificacion,
    };

    //generar el pdf
    const pdfBuffer = generarPDFConstancia(pdfData);

    // Enviar el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="constancia.pdf"');
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