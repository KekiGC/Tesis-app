import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';
import { ITreatment } from './treatment';

interface Ihabits {
  alcohol: string;
  estupefacientes: string;
  actividad_fisica: string;
  tabaco: string;
  cafe: string;
  sueño: string;
  alimentacion: string;
  sexuales: string;
}

export interface IMedicalRecord extends Document {
  patientId: IPatient['_id'];
  observaciones: string;
  ant_medicos: string;
  ant_familiares: string;
  ant_laborales: string;
  alergias: string;
  vacunas: string;
  medicamentos: string; // cambiar a objeto o otra tabla de medicinas y separar de tratamientos
  enf_cronicas: string;
  habits: Ihabits;
  treatment: ITreatment['_id'];
}

const habitsSchema = new Schema<Ihabits>({
  alcohol: { type: String, required: true },
  estupefacientes: { type: String, required: true },
  actividad_fisica: { type: String, required: true },
  tabaco: { type: String, required: true },
  cafe: { type: String, required: true },
  sueño: { type: String, required: true },
  alimentacion: { type: String, required: true },
  sexuales: { type: String, required: true },
});


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
  habits: {
    type: habitsSchema,
    required: true,
  },
  treatment: {
    type: Schema.Types.ObjectId,
    ref: 'Treatment',
    required: false,
  },
},
{
  timestamps: true,
  versionKey: false,
});

export default model<IMedicalRecord>('MedicalRecord', medicalRecordSchema);