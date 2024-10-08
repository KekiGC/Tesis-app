import { Request, Response } from 'express';
import aptitudeProof, {  IAptitudeProof } from '../models/aptitudeProof';
import Patient from '../models/patient';
import User from '../models/user';
import UserInfo from '../models/userInfo';
import { generarPDFConstancia, DatosConstancia } from '../services/pdfApt.service';
import { ICompany } from '../models/company';

// obtener las pruebas de aptitud de un doctor
export const getAptitudeProofs = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ msg: 'Please provide a doctor id' });
  }

  try {
    // Buscar las constancias de aptitud y poblar la información del paciente
    const aptitudeProofs = await aptitudeProof.find({ doctorId })
      .populate({
        path: 'patientId',
        select: 'name lastname cedula' 
      });

    // Modificar la estructura de la respuesta para incluir el nombre completo y cédula del paciente
    const result = aptitudeProofs.map((proof: any) => ({
      ...proof.toObject(), // Convertir a objeto JavaScript y mantener la estructura original
      nombrePaciente: proof.patientId ? `${proof.patientId.name} ${proof.patientId.lastname}` : 'Unknown',
      cedulaPaciente: proof.patientId ? proof.patientId.cedula : 'N/A',
    }));

    return res.status(200).json(result);
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

    const patient = await Patient.findById(getAptProof.patientId).populate('company').exec();
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const doctor = await User.findById(getAptProof.doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const doctorInfo = await UserInfo.findOne({ user: getAptProof.doctorId });
    if (!doctorInfo) {
      return res.status(404).json({ msg: 'Doctor info not found' });
    }

    const company = patient.company as ICompany;

    const pdfData: DatosConstancia = {
      nombrePaciente: patient.name,
      apellidoPaciente: patient.lastname,
      cedulaPaciente: patient.cedula,
      edadPaciente: patient.age,
      sexoPaciente: patient.gender,
      fechaNacimientoPaciente: patient.birthdate.toLocaleDateString('es-ES'),
      empresa: company.name, 
      cargo: patient.position.description,
      concepto: getAptProof.concepto,
      clasificacion: getAptProof.clasificacion,
      observaciones: getAptProof.observaciones,
      conclusiones: getAptProof.conclusiones,
      nombreDoctor: `${doctor.name} ${doctor.lastname}`,
      correoDoctor: doctor.email,
      especialidadDoctor: doctorInfo.especialidad,
      direccionDoctor: doctorInfo.direccion,
      telefonoDoctor: doctorInfo.telefono,
      inscripcionCMDoctor: doctorInfo.inscripcionCM,
      registroDoctor: doctorInfo.registro,
      firmaDoctor: doctorInfo.firma,
    };

    const pdfBuffer = await generarPDFConstancia(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Constancia_aptitud_${patient.name}_${patient.lastname}.pdf`)

    return res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// crear una prueba de aptitud
export const createAptitudeProof = async (req: Request, res: Response): Promise<Response> => {
  const { cedulaPaciente, doctorId, concepto, clasificacion, observaciones, conclusiones } = req.body;

  try {
    if (!cedulaPaciente || !doctorId || !concepto || !clasificacion) {
      return res.status(400).json({ msg: 'Please provide all fields' });
    }

    
    const patient = await Patient.findOne({cedula: cedulaPaciente}).populate('company').exec();
    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    const doctorInfo = await UserInfo.findOne({user: doctorId});
    if (!doctorInfo) {
      return res.status(404).json({ msg: 'Doctor info not found' });
    }
    
    const company = patient.company as ICompany;
    
    const newAptitudeProof: IAptitudeProof = new aptitudeProof({
      patientId: patient._id,
      doctorId,
      concepto,
      clasificacion,
      observaciones,
      conclusiones,
    });

    const savedAptitudeProof = await newAptitudeProof.save();

    //preparar los datos para el pdf
    const pdfData: DatosConstancia = {
      nombrePaciente: patient.name,
      apellidoPaciente: patient.lastname,
      cedulaPaciente: patient.cedula,
      edadPaciente: patient.age,
      sexoPaciente: patient.gender,
      fechaNacimientoPaciente: patient.birthdate.toLocaleDateString('es-ES'),
      empresa: company.name, 
      cargo: patient.position.description,
      concepto: savedAptitudeProof.concepto,
      clasificacion: savedAptitudeProof.clasificacion,
      observaciones: savedAptitudeProof.observaciones,
      conclusiones: savedAptitudeProof.conclusiones,
      nombreDoctor: `${doctor.name} ${doctor.lastname}`,
      correoDoctor: doctor.email,
      especialidadDoctor: doctorInfo.especialidad,
      direccionDoctor: doctorInfo.direccion,
      telefonoDoctor: doctorInfo.telefono,
      inscripcionCMDoctor: doctorInfo.inscripcionCM,
      registroDoctor: doctorInfo.registro,
      firmaDoctor: doctorInfo.firma,
    };

    //generar el pdf
    const pdfBuffer = await generarPDFConstancia(pdfData);

    // Enviar el PDF como respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Constancia_aptitud_${patient.name}_${patient.lastname}.pdf`)
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