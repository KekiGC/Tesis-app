import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IPatient } from './patient';

export interface IAptitudeProof extends Document {
    patientId: IPatient['_id'];
    doctorId: IUser['_id'];
    concepto: string;
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