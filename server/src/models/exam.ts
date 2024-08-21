import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';
import { IUser } from './user';

interface IVitalSigns {
    FC: number; // Frecuencia Cardíaca
    TA: string; // Tensión Arterial (formato número/numero)
    FR: number; // Frecuencia Respiratoria
}

export interface IExam extends Document {
    patientId: IPatient['_id'];
    doctorId: IUser['_id'];
    impresion_general: string;
    peso: number;
    talla_cms: number;
    piel: string;
    cabeza: string;
    torax_corazon_pulmones: string;
    aparato_respiratorio: string;
    abdomen_pelvis: string;
    genitales: string;
    hernia_umbilical: string;
    hernia_inguinal: string;
    sist_nervioso: string;
    osteomioarticular: string;
    vitalSigns: IVitalSigns;    
}

const VitalSignsSchema = new Schema<IVitalSigns>({
    FC: { type: Number, required: true },
    TA: { type: String, required: true },
    FR: { type: Number, required: true },
  });

const examSchema = new Schema({
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
    impresion_general: {
        type: String,
        required: true,
        trim: true,
    },
    peso: {
        type: Number,
        required: true,
    },
    talla_cms: {
        type: Number,
        required: true,
    },
    piel: {
        type: String,
        required: true,
        trim: true,
    },
    cabeza: {
        type: String,
        required: true,
        trim: true,
    },
    torax_corazon_pulmones: {
        type: String,
        required: true,
        trim: true,
    },
    aparato_respiratorio: {
        type: String,
        required: true,
        trim: true,
    },
    abdomen_pelvis: {
        type: String,
        required: true,
        trim: true,
    },
    genitales: {
        type: String,
        required: true,
        trim: true,
    },
    hernia_umbilical: {
        type: String,
        enum: ['si', 'no'],
        required: true,
        trim: true,
    },
    hernia_inguinal: {
        type: String,
        enum: ['si', 'no'],
        required: true,
        trim: true,
    },
    sist_nervioso: {
        type: String,
        required: true,
        trim: true,
    },
    osteomioarticular: {
        type: String,
        required: true,
        trim: true,
    },
    vitalSigns: {
        type: VitalSignsSchema,
        required: true,
    },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<IExam>('Exam', examSchema);