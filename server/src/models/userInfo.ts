import { Schema, model, Document } from 'mongoose';
import { IUser } from './user';

export interface IUserInfo extends Document {
    user: IUser['_id'];
    especialidad: string;
    telefono: string;
    direccion: string;
    cedula: string;
    inscripcionCM: string;
    registro: string;
    firma: string | null;
}

const userInfoSchema = new Schema<IUserInfo>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    especialidad: { type: String, required: false, trim: true },
    telefono: { type: String, required: false, trim: true },
    direccion: { type: String, required: false, trim: true },
    cedula: { type: String, required: true, trim: true },
    inscripcionCM: { type: String, required: true, trim: true },
    registro: { type: String, required: true, trim: true },
    firma: { type: String, required: true, trim: true }
}, {
    timestamps: true,
    versionKey: false,
});

export default model<IUserInfo>('UserInfo', userInfoSchema);