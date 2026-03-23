import { Schema , model , Types } from "mongoose";

interface ILike {
    userId: Types.ObjectId;
    food: Types.ObjectId;
}

const likeSchema =new Schema<ILike>({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    food: { type: Types.ObjectId, ref: 'Food', required: true },
}, {timestamps: true });

likeSchema.index({ userId: 1, food: 1 }, { unique: true });
likeSchema.index({ food: 1 });

const Like = model('Like', likeSchema);

export default Like;