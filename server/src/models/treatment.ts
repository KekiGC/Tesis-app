import { model, Schema, Document } from 'mongoose';
import { IMedicines } from './medicine';
import { IMedicalRecord } from './medicalRecord';

export interface ITreatment extends Document {
  medicalRecord: IMedicalRecord['_id'];
  medicines: IMedicines[];
  description: string;
  dose: string;
  duration: string;
}

const treatmentSchema = new Schema({
  medicalRecord: {
    type: Schema.Types.ObjectId,
    ref: 'MedicalRecord',
    required: true,
  },
  medicines: [{ type: Schema.Types.ObjectId, ref: 'Medicine', required: false }],
  description: { type: String, required: true, trim: true },
  dose: { type: String, required: false, trim: true },
  duration: { type: String, required: false, trim: true },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<ITreatment>('Treatment', treatmentSchema);