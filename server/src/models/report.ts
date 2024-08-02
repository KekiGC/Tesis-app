import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';
import { IUser } from './user';

export interface IReport extends Document {
    patientId: IPatient['_id'];
    doctorId: IUser['_id'];
    fecha_reporte: Date;
    sintomas: string;
    hallazgos: string;
    examenes: string;
    diagnostico: string;
}

const reportSchema = new Schema({
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
    fecha_reporte: {
        type: Date,
        required: true,
    },
    sintomas: {
        type: String,
        required: true,
        trim: true,
    },
    hallazgos: {
        type: String,
        required: true,
        trim: true,
    },
    examenes: {
        type: String,
        required: true,
        trim: true,
    },
    diagnostico: {
        type: String,
        required: true,
        trim: true,
    },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<IReport>('Report', reportSchema);