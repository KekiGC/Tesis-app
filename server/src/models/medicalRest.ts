import { Document, Schema, model } from 'mongoose';
import { IPatient } from './patient'; // Asegúrate de importar el modelo de paciente

export interface IMedicalRest extends Document {
  patientId: IPatient['_id'];
  sintomas: string;
  fecha: Date;
  diagnostico: string;
  fecha_inicio: Date;
  fecha_final: Date;
  comentarios: string;
  nombre_paciente?: string;
  cedula_paciente?: string;
}

const medicalRestSchema = new Schema<IMedicalRest>({
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
  nombre_paciente: {
    type: String,
  },
  cedula_paciente: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
});

export default model<IMedicalRest>('MedicalRest', medicalRestSchema);
