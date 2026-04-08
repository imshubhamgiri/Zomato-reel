import { Schema, model, Types } from 'mongoose';

type AddressLabel = 'Home' | 'Work' | 'Other';

interface UserAddress {
    _id?: Types.ObjectId;
    label?: AddressLabel;
    fullName?: string;
    phone?: string;
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    landmark?: string;
    isDefault?: boolean;
}

interface User {
    name:string;
    gender?: 'Male' | 'Female' | 'Other';
    email:string;
    password:string;
    address?: UserAddress[];
    phone?:string;
}

const UserSchema = new Schema<User>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false } ,
     gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: [
        {
            label: { type: String, enum: ['Home', 'Work', 'Other'] },
            fullName: { type: String, trim: true },
            phone: { type: String, trim: true },
            line1: { type: String, trim: true },
            city: { type: String },
            state: { type: String },
            postalCode: { type: String, trim: true },
            country: { type: String, trim: true },
            landmark: { type: String, trim: true },
            isDefault: { type: Boolean, default: false }
        }
    ],
    phone: { type: String }
},{
    timestamps:true
})


export default model('User', UserSchema);