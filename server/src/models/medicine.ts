import { model, Schema, Document } from 'mongoose';

export interface IMedicines extends Document {
  name: string;
  type: string;
  use: string;
}

const medicinesSchema = new Schema<IMedicines>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  use: { type: String, required: true },
},{
    timestamps: true,
    versionKey: false,
});

export default model<IMedicines>('Medicine', medicinesSchema);