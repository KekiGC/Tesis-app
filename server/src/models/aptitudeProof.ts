import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IPatient } from './patient';

export interface IAptitudeProof extends Document {
    patientId: IPatient['_id'];
    doctorId: IUser['_id'];
    concepto: string;
    name: string;
    cedula: string;
    edad: number;
    empresa: string;
    cargo: string;
    clasificacion: string;
}

const aptitudeProofSchema = new Schema({
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
    concepto: {
        type: String,
        enum: ['preempleo', 'prevacacional', 'postvacacional', 'retiro'],
        required: true,
        trim: true,
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
    edad: {
        type: Number,
        required: true,
    },
    empresa: {
        type: String,
        required: true,
        trim: true,
    },
    cargo: {
        type: String,
        required: true,
        trim: true,
    },
    clasificacion: {
        type: String,
        enum: ['apto', 'no apto'],
        required: true,
        trim: true,
    },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<IAptitudeProof>('AptitudeProof', aptitudeProofSchema);