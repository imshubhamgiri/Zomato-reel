import mongoose ,{  Schema , model} from 'mongoose';
import { IFood } from '../types';

 const foodSchema = new Schema<IFood>({
    name: { type: String, required: true, trim: true },
    video: { type: String, trim: true },
    videoPublicId: { type: String, trim: true },
    image: { type: String, trim: true },
    type: { type: String,
         enum: ['standard', 'reel'], 
         required: true,
          index: true 
        },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    likeCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPartner', required: true }
}, {
    timestamps: true
});

foodSchema.index({ foodPartner: 1, createdAt: -1 });
foodSchema.index({ _id: 1, createdAt: -1 });
foodSchema.index({ createdAt: -1 });
foodSchema.index({ likeCount: -1 });

const Food = model<IFood>('Food', foodSchema);

export default Food;