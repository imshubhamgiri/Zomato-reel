import { Schema, model, Types } from 'mongoose';

interface RefreshTokenDocument {
  userId: Types.ObjectId;
  userType: 'user' | 'partner';
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ['user', 'partner'], required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index({ userId: 1, userType: 1 });
refreshTokenSchema.index({ expiresAt: 1 });

const RefreshToken = model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
