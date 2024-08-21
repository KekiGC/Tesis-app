import { Schema, model, Document } from 'mongoose';
import { IMedicalRecord } from './medicalRecord';

export interface IExternalExam extends Document {
  medicalRecord: IMedicalRecord['_id'];
  type: string;
  description: string;
  date: Date;
  path: string;
}

const externalExamSchema = new Schema<IExternalExam>({
    medicalRecord: { type: Schema.Types.ObjectId, ref: 'Medical_Record', required: true, index: true },
    type: { type: String, enum: ['Radiografia', 'Pruebas de sangre', 'Ultrasonido'], required: true, trim: true },
    description: { type: String, required: false, trim: true },
    date: { type: Date, required: true },
    path: { type: String, required: true, validate: {
        validator: (v: string) => {
            return v.includes('.jpg') || v.includes('.png') || v.includes('.jpeg') || v.includes('.pdf');
        },
        message: 'Invalid file extension'
    } }
});

export default model<IExternalExam>('External_Exam', externalExamSchema);