import mongoose ,{  Schema , Types, model} from 'mongoose';


export interface IFood  {
  name: string;
  video: string;
  videoPublicId: string;
  description: string;
  price: number;
  likeCount: number;
  saveCount: number;
  foodPartner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


 const foodSchema = new Schema<IFood>({
    name: { type: String, required: true, trim: true },
    video: { type: String, required: true, trim: true },
    videoPublicId: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    // category: { type: String, required: true, trim: true },
    likeCount: { type: Number, default: 0 },
    saveCount: { type: Number, default: 0 },
    foodPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodPartner', required: true }
}, {
    timestamps: true
});

const Food = model<IFood>('Food', foodSchema);
export default Food;