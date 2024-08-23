import { Document, Schema, model } from 'mongoose';
import { IPatient } from './patient';
import { IUser } from './user';

export interface IMedicalRest extends Document {
  doctorId: IUser['_id'];
  patientId: IPatient['_id'];
  sintomas: string;
  fecha: Date;
  diagnostico: string;
  fecha_inicio: Date;
  fecha_final: Date;
  comentarios: string;
}

const medicalRestSchema = new Schema<IMedicalRest>({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  sintomas: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  diagnostico: {
    type: String,
    required: true,
  },
  fecha_inicio: {
    type: Date,
    required: true,
  },
  fecha_final: {
    type: Date,
    required: true,
  },
  comentarios: {
    type: String,
    required: true,
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default model<IMedicalRest>('MedicalRest', medicalRestSchema);
