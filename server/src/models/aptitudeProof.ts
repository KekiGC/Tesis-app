import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IPatient } from './patient';

export interface IAptitudeProof extends Document {
    patientId: IPatient['_id'];
    doctorId: IUser['_id'];
    concepto: string;
    clasificacion: string;
    conclusiones: string;
    observaciones: string;
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
        enum: ['Preempleo', 'Prevacacional', 'Postvacacional', 'Retiro'],
        required: true,
        trim: true,
    },
    clasificacion: {
        type: String,
        enum: ['Apto', 'No apto'],
        required: true,
        trim: true,
    },
    conclusiones: {
        type: String,
        trim: true,
        required: false,
    },
    observaciones: {
        type: String,
        trim: true,
        required: false,
    },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<IAptitudeProof>('AptitudeProof', aptitudeProofSchema);