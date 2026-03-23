import User from '../models/userModel';
import { FoodPartner } from '../models/foodPartner.model';
import RefreshToken from '../models/refreshToken.model';

export const findUserByEmail = async (email: string): Promise<any> => {
  return User.findOne({ email }).select('+password').lean();
};

export const findUserPublicByEmail = async (email: string): Promise<any> => {
  return User.findOne({ email }).lean();
};

export const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<any> => {
  const user = new User(payload);
  return user.save();
};

export const findPartnerByEmail = async (email: string): Promise<any> => {
  return FoodPartner.findOne({ email }).select('+password').lean();
};

export const findPartnerPublicByEmail = async (email: string): Promise<any> => {
  return FoodPartner.findOne({ email }).lean();
};

export const createPartner = async (payload: {
  name: string;
  email: string;
  password: string;
  restaurantName: string;
  phone: string;
  address: string;
}): Promise<any> => {
  const partner = new FoodPartner(payload);
  return partner.save();
};

export const findUserById = async (id: string): Promise<any> => {
  return User.findById(id).lean();
};

export const findPartnerById = async (id: string): Promise<any> => {
  return FoodPartner.findById(id).lean();
};

export const createRefreshTokenRecord = async (payload: {
  userId: string;
  userType: 'user' | 'partner';
  tokenHash: string;
  expiresAt: Date;
}): Promise<any> => {
  return RefreshToken.create(payload);
};

export const findActiveRefreshToken = async (tokenHash: string): Promise<any> => {
  return RefreshToken.findOne({ tokenHash, revokedAt: null }).lean();
};

export const revokeRefreshTokenByHash = async (tokenHash: string): Promise<any> => {
  return RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
};

export const revokeAllRefreshTokensForUser = async (
  userId: string,
  userType: 'user' | 'partner'
): Promise<any> => {
  return RefreshToken.updateMany(
    { userId, userType, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
};
