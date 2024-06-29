import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';
import { IUser } from './user';

export interface IAppointment extends Document {
  patientId: IPatient['_id'];
  doctorId: IUser['_id'];
  date: Date;
  time: string;
  status: string;
  motive: string;
}

const appointmentSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
    required: true,
    trim: true,
  },
  motive: {
    type: String,
    required: true,
    trim: true,
  },
});

export default model<IAppointment>('Appointment', appointmentSchema);
