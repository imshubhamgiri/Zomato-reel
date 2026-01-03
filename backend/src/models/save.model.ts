import { Schema , model , Types} from "mongoose";
interface ISave {
    userId: Types.ObjectId;
    food: Types.ObjectId;
}
const saveSchema = new Schema<ISave>({
userId: { type: Types.ObjectId, ref: 'User', required: true },
    food: { type: Types.ObjectId, ref: 'food', required: true },
}, {timestamps: true })

const save = model('save', saveSchema)
export default save;