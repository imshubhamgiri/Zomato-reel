import { Schema , model , Types} from "mongoose";
interface ISave {
    userId: Types.ObjectId;
    food: Types.ObjectId;
}
const saveSchema = new Schema<ISave>({
userId: { type: Types.ObjectId, ref: 'User', required: true },
    food: { type: Types.ObjectId, ref: 'Food', required: true },
}, {timestamps: true })

saveSchema.index({ userId: 1, food: 1 }, { unique: true });
saveSchema.index({ food: 1 });

const Save = model('Save', saveSchema)
export default Save;