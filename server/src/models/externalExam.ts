import { Schema, model, Document } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Load exam types from environment variables
const EXAM_TYPES = process.env.EXAM_TYPES?.split(',') || ['Radiografia', 'Pruebas de sangre', 'Ultrasonido', 'Tomografía', 'Resonancia magnética'];

export interface IExternalExam extends Document {
  type: string;
  description: string;
  date: Date;
  path: string;
}

const fileValidator = {
  validator: (v: string) => {
    return v.includes('.jpg') || v.includes('.png') || v.includes('.jpeg') || v.includes('.pdf');
  },
  message: 'Invalid file extension',
};

const externalExamSchema = new Schema<IExternalExam>({
  type: {
    type: String,
    enum: EXAM_TYPES,
    required: true,
    trim: true,
  },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  path: { type: String, required: true, validate: fileValidator },
});

export default model<IExternalExam>('ExternalExam', externalExamSchema);