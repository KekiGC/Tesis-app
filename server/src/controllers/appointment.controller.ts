import { Request, Response } from 'express';
import Appointment, { IAppointment } from '../models/appointment';
import Patient, { IPatient } from '../models/patient';
import User, { IUser } from '../models/user';
import { sendEmail } from '../services/emailService';

// obtener todas las citas de un doctor por su id, ordenadas por fecha
export const getImminentAppointments = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const currentDate = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(currentDate.getDate() + 7);

    // Find appointments within the next 7 days
    const imminentAppointments = await Appointment.find({
      doctorId: doctorId,
      date: { $gte: currentDate, $lte: oneWeekFromNow },
    })
      .sort({ date: 1 }) // Sort by date in ascending order
      .populate('patientId', 'name lastname') // Populate patient's name and lastname
      .exec();

    return res.status(200).json(imminentAppointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getDoctorAppointments = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;

  if (!doctorId) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const appointments = await Appointment.find({ doctorId: doctorId }).sort({ date: 1 }).populate('patientId', 'name lastname').exec();
    return res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getFilteredAppointments = async (req: Request, res: Response): Promise<Response> => {
  const { doctorId } = req.params;
  const { startTime, endTime, patientName } = req.query;

  if (!doctorId) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const currentDate = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(currentDate.getDate() + 7);

    // Base query: appointments within the next 7 days for the specified doctor
    let query: any = {
      doctorId: doctorId,
      date: { $gte: currentDate, $lte: oneWeekFromNow },
    };

    // Time filtering: if startTime and endTime are provided, filter by that range
    if (startTime && endTime) {
      query.date = {
        ...query.date,
        $gte: new Date(startTime as string),
        $lte: new Date(endTime as string),
      };
    }

    // Patient name filtering: if patientName is provided, filter by that name
    if (patientName) {
      const patientRegex = new RegExp(patientName as string, 'i'); // Case-insensitive regex
      const patients = await Patient.find({ name: patientRegex });
      const patientIds = patients.map(patient => patient._id);
      query.patientId = { $in: patientIds };
    }

    const filteredAppointments = await Appointment.find(query)
      .sort({ date: 1 }) // Sort by date in ascending order
      .populate('patientId', 'name lastname') // Populate patient's name and lastname
      .exec();

    return res.status(200).json(filteredAppointments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// obtener una cita por su id
export const getAppointment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const appointment = await Appointment.findById(id).exec();
    return res.status(200).json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// crear una nueva cita
export const createAppointment = async (req: Request, res: Response): Promise<Response> => {
  const { patientId, doctorId, date, time, motive } = req.body;

  if (!patientId || !doctorId || !date || !time || !motive) {
    return res.status(400).json({ msg: 'Please provide all fields' });
  }

  try {
    const newAppointment: IAppointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      motive,
    });

    const savedAppointment = await newAppointment.save();

    // fetch patient and doctor information
    const patient = await Patient.findById(patientId).exec();
    const doctor = await User.findById(doctorId).exec();

    // send email to patient and doctor
    if (patient && doctor) {
      const emailSubject = 'Nueva cita médica';
      const emailText = `Hola ${patient.name},\n\nSe ha agendado una nueva cita con el doctor ${doctor.name} para el ${date} a las ${time}.\n\nMotivo: ${motive}\n\nSaludos,\nEquipo de salud`;

      await sendEmail(patient.email, emailSubject, emailText);
      await sendEmail(doctor.email, emailSubject, emailText);
    }

    return res.status(201).json(savedAppointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// actualizar una cita
export const updateAppointment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { status, date, time, motive } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { status, date, time, motive }, { new: true }).exec();
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

// eliminar una cita
export const deleteAppointment = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndDelete(id).exec();
    return res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};