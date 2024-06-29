import { Request, Response } from 'express';
import Appointment, { IAppointment } from '../models/appointment';

// obtener las citas de un paciente por su id
export const getAppointments = async (req: Request, res: Response): Promise<Response> => {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ msg: 'Please provide an id' });
  }

  try {
    const appointments = await Appointment.find({ patientId: patientId }).sort({ createdAt: -1 }).exec();
    return res.status(200).json(appointments);
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