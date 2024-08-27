import Appointment from '../models/appointment';
import { sendEmail } from '../services/emailService'; // Import your email service
import User, { IUser } from '../models/user'; // Import your User model
import Patient, { IPatient } from '../models/patient'; // Import your Patient model

export const sendAppointmentReminders = async () => {
    try {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
  
      const upcomingAppointments = await Appointment.find({
        date: { $gte: now, $lt: tomorrow },
        status: 'pending',
      })
        .populate('doctorId', 'name lastname email')
        .populate('patientId', 'name lastname email')
        .exec();
  
      for (const appointment of upcomingAppointments) {
        const doctor = await User.findById(appointment.doctorId) as IUser;
        const patient = await Patient.findById(appointment.patientId) as IPatient;
  
        const doctorEmail = doctor.email;
        const patientEmail = patient.email;
        const appointmentDate = appointment.date.toLocaleDateString('es-ES');
        const appointmentTime = appointment.time;
  
        const doctorMessage = `Hola Dr. ${doctor.name},\n\nTienes una cita programada con el paciente ${patient.name} ${patient.lastname} para el ${appointmentDate} a las ${appointmentTime}.\n\nMotivo: ${appointment.motive}\n\nSaludos,\nEquipo de salud`;
        const patientMessage = `Recordatorio: Tienes una cita programada con el Dr. ${doctor.name} ${doctor.lastname} el ${appointmentDate} a las ${appointmentTime}.\n\nMotivo: ${appointment.motive}\n\nSaludos,\nEquipo de salud`;
  
        await sendEmail(doctorEmail, 'Recordatorio de Cita', doctorMessage);
        await sendEmail(patientEmail, 'Recordatorio de Cita', patientMessage);
      }
  
      console.log('Reminders sent successfully.');
    } catch (error) {
      console.error('Error sending reminders:', error);
    }
  };

