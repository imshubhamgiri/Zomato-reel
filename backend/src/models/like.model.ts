import { Schema , model , Types } from "mongoose";

interface ILike {
    userId: Types.ObjectId;
    food: Types.ObjectId;
}

const likeSchema =new Schema<ILike>({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    food: { type: Types.ObjectId, ref: 'food', required: true },
}, {timestamps: true });

const Like = model('Like', likeSchema);

export default Like;