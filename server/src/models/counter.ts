import { Schema, model, Document } from 'mongoose';

export interface ICounter extends Document {
  id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export default model<ICounter>('Counter', counterSchema);