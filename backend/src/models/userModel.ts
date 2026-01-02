import  {  Schema , model} from 'mongoose';

interface User {
    name:string;
    email:string;
    password:string;
}

const UserSchema = new Schema<User>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String } 
},{
    timestamps:true
})

export default model('User', UserSchema);