import { model, Schema, Document } from 'mongoose';
import { IUser } from './user';
import { ICompany } from './company';

interface IPosition {
    description: string;
} 
export interface IPatient extends Document {
  email: string;
  name: string;
  lastname: string;
  doctorId: IUser['_id'];
  age: number;
  cedula: string;
  photo: string | null;
  gender: string;
  birthdate: Date;
  phone: string;
  address: string;
  company: ICompany['_id'];
  grupoSanguineo: string;
  position: IPosition;
}

const positionSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
});

const patientSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    cedula: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    photo: {
        type: String,
        required: false,
        trim: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
        trim: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    grupoSanguineo: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true,
        trim: true,
    },
    position: {
        type: positionSchema,
        required: true,
    },
},
    {
        versionKey: false,
        timestamps: true,
    }
);

export default model<IPatient>('Patient', patientSchema);