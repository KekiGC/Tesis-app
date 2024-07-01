import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';

export interface IMedicalRest extends Document {
    patientId: IPatient['_id'];
    nombre_paciente: string;
    cedula_paciente: string;
    sintomas: string;
    fecha: Date;
    diagnostico: string;
    fecha_inicio: Date;
    fecha_final: Date;
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
        type: Date,
        required: true,
    },
    diagnostico: {
        type: String,
        required: true,
        trim: true,
    },
    fecha_inicio: {
        type: Date,
        required: true,
    },
    fecha_final: {
        type: Date,
        required: true,
    },
});

export default model<IMedicalRest>('MedicalRest', medicalRestSchema);