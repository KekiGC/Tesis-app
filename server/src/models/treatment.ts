import { model, Schema, Document } from 'mongoose';

interface IMedicines {
  name: string;
  type: string;
  use: string;
}

export interface ITreatment extends Document {
  medicines: IMedicines[];
  description: string;
  dose: string;
  duration: string;
}

const medicinesSchema = new Schema<IMedicines>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  use: { type: String, required: true },
});

const treatmentSchema = new Schema({
  medicines: [medicinesSchema],
  description: { type: String, required: true, trim: true },
  dose: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<ITreatment>('Treatment', treatmentSchema);