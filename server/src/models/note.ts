import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';

export interface INote extends Document {
  doctorId: IUser['_id'];
  content: string;
}

const noteSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
},
{
  timestamps: true,
  versionKey: false,
});

export default model<INote>('Note', noteSchema);