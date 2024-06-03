import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';

export interface IMedicalRecord extends Document {
  patientId: IPatient['_id'];
  observaciones: string;
  ant_personales: string;
  ant_familiares: string;
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
  ant_personales: {
    type: String,
    required: false,
    trim: true,
  },
  ant_familiares: {
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