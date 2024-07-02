import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';

export interface IMedicalRest extends Document {
    patientId: IPatient['_id'];
    nombre_paciente: string;
    cedula_paciente: string;
    sintomas: string;
    fecha: string;
    diagnostico: string;
    fecha_inicio: string;
    fecha_final: string;
    comentarios: string | null;
}

const medicalRestSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    nombre_paciente: {
        type: String,
        required: true,
        trim: true,
    },
    cedula_paciente: {
        type: String,
        required: true,
        trim: true,
    },
    sintomas: {
        type: String,
        required: true,
        trim: true,
    },
    fecha: {
        type: String,
        required: true,
    },
    diagnostico: {
        type: String,
        required: true,
        trim: true,
    },
    fecha_inicio: {
        type: String,
        required: true,
    },
    fecha_final: {
        type: String,
        required: true,
    },
    comentarios: {
        type: String,
        required: false,
    },
});

export default model<IMedicalRest>('MedicalRest', medicalRestSchema);