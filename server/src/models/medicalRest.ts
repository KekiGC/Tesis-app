import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';

export interface IMedicalRest extends Document {
    patientId: IPatient['_id'];
    name: string;
    cedula: string;
    sintomas: string;
    fecha_reporte: Date;
    diagnostico: string;
    fecha_inicio: Date;
    fecha_fin: Date;
}

const medicalRestSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    cedula: {
        type: String,
        required: true,
        trim: true,
    },
    sintomas: {
        type: String,
        required: true,
        trim: true,
    },
    fecha_reporte: {
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
    fecha_fin: {
        type: Date,
        required: true,
    },
});

export default model<IMedicalRest>('MedicalRest', medicalRestSchema);