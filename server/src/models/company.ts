import { model, Schema, Document } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    rif: string;
    address: string;
    phone: string;
    email: string;
}

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rif: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
},
{
    timestamps: true,
    versionKey: false,
});

export default model<ICompany>('Company', companySchema);