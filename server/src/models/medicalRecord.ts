import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';

export interface IMedicalRecord extends Document {
  patientId: IPatient['_id'];
  observaciones: string;
  ant_medicos: string;
  ant_familiares: string;
  ant_laborales: string;
  habitos: string;
  alergias: string;
  vacunas: string;
  medicamentos: string;
  enf_cronicas: string;
}

const medicalRecordSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  observaciones: {
    type: String,
    required: false,
    trim: true,
  },
  ant_medicos: {
    type: String,
    required: false,
    trim: true,
  },
  ant_familiares: {
    type: String,
    required: false,
    trim: true,
  },
  ant_laborales: {
    type: String,
    required: false,
    trim: true,
  },
  habitos: {
    type: String,
    required: false,
    trim: true,
  },
  alergias: {
    type: String,
    required: false,
    trim: true,
  },
  vacunas: {
    type: String,
    required: false,
    trim: true,
  },
  medicamentos: {
    type: String,
    required: false,
    trim: true,
  },
  enf_cronicas: {
    type: String,
    required: false,
    trim: true,
  },
});

export default model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);