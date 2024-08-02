import { model, Schema, Document } from 'mongoose';
import { IPatient } from './patient';
import { IUser } from './user';

export interface IInvoice extends Document {
  patientId: IPatient['_id'];
  doctorId: IUser['_id'];
  fecha: Date;
  numero_control: number;
  nombre_razon: string;
  dir_fiscal: string;
  rif: string;
  forma_pago: string;
  contacto: string;
  descripcion_servicio: string;
  total: number;
}

const invoiceSchema = new Schema({
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
  fecha: {
    type: Date,
    required: true,
  },
  numero_control: {
    type: Number,
    required: true,
    unique: true,
  },
  nombre_razon: {
    type: String,
    required: true,
    trim: true,
  },
  dir_fiscal: {
    type: String,
    required: true,
    trim: true,
  },
  rif: {
    type: String,
    required: true,
    trim: true,
  },
  forma_pago: {
    type: String,
    required: true,
    trim: true,
  },
  contacto: {
    type: String,
    required: true,
    trim: true,
  },
  descripcion_servicio: {
    type: String,
    required: true,
    trim: true,
  },
  total: {
    type: Number,
    required: true,
  },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<IInvoice>('Invoice', invoiceSchema);