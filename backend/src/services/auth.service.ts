import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ConflictError, AuthError } from '../utils/error';
import type {
  AuthTokenPayload,
  AuthTokens,
  FoodPartnerRegister,
  PartnerResponse,
  ProfileRegister,
  ProfileResponse,
  UserLogin,
  FoodPartnerLogin,
} from '../types';
import {
  createPartner,
  createRefreshTokenRecord,
  createUser,
  findActiveRefreshToken,
  findPartnerByEmail,
  findPartnerById,
  findPartnerPublicByEmail,
  findUserByEmail,
  findUserById,
  findUserPublicByEmail,
  revokeAllRefreshTokensForUser as revokeAllRefreshTokensForUserRepo,
  revokeRefreshTokenByHash,
  userExists,
  partnerExists,
} from '../repositories/auth.repository';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getAccessSecret = (): string => process.env.JWT_SECRET as string;
const getRefreshSecret = (): string => (process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET) as string;

const hashToken = (rawToken: string): string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

const getExpiryDate = (ms: number): Date => new Date(Date.now() + ms);

const issueTokens = async (payload: AuthTokenPayload): Promise<AuthTokens> => {
  const accessToken = jwt.sign(payload, getAccessSecret(), { 
    expiresIn: ACCESS_TOKEN_TTL,
    jwtid: crypto.randomBytes(16).toString('hex')
  });
  const refreshToken = jwt.sign(payload, getRefreshSecret(), { 
    expiresIn: REFRESH_TOKEN_TTL,
    jwtid: crypto.randomBytes(16).toString('hex')
  });

  await createRefreshTokenRecord({
    userId: payload.Id,
    userType: payload.type,
    tokenHash: hashToken(refreshToken),
    expiresAt: getExpiryDate(REFRESH_COOKIE_MAX_AGE),
  });

  return { accessToken, refreshToken };
};

export const getCookieOptions = (maxAge: number) => ({
  // Cross-site frontend (Vercel) + backend (Render) needs SameSite=None and Secure=true.
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ||
    (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  maxAge,
});

export const getAccessCookieOptions = () => getCookieOptions(ACCESS_COOKIE_MAX_AGE);
export const getRefreshCookieOptions = () => getCookieOptions(REFRESH_COOKIE_MAX_AGE);

export const registerUser = async (
  payload: ProfileRegister
): Promise<{ profile: ProfileResponse; tokens: AuthTokens }> => {
  const existingUser = await findUserPublicByEmail(payload.email);
  if (existingUser) {
    throw new ConflictError('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const createdUser = await createUser({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
  });

  const tokenPayload: AuthTokenPayload = {
    Id: createdUser._id.toString(),
    email: createdUser.email,
    type: 'user',
  };
  const tokens = await issueTokens(tokenPayload);

  return {
    profile: {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      userType: 'user',
    },
    tokens,
  };
};

export const loginUser = async (
  payload: UserLogin
): Promise<{ profile: ProfileResponse; tokens: AuthTokens }> => {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw new AuthError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(payload.password, user.password);
  if (!isMatch) {
    throw new AuthError('Invalid credentials');
  }

  await revokeAllRefreshTokensForUserRepo(user._id.toString(), 'user');

  const tokenPayload: AuthTokenPayload = {
    Id: user._id.toString(),
    email: user.email,
    type: 'user',
  };
  const tokens = await issueTokens(tokenPayload);

  return {
    profile: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      userType: 'user',
    },
    tokens,
  };
};

export const registerPartner = async (
  payload: FoodPartnerRegister
): Promise<{ profile: PartnerResponse; tokens: AuthTokens }> => {
  const existingPartner = await findPartnerPublicByEmail(payload.email);
  if (existingPartner) {
    throw new ConflictError('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const createdPartner = await createPartner({
    ...payload,
    password: hashedPassword,
  });

  const tokenPayload: AuthTokenPayload = {
    Id: createdPartner._id.toString(),
    email: createdPartner.email,
    type: 'partner',
  };
  const tokens = await issueTokens(tokenPayload);

  return {
    profile: {
      id: createdPartner._id.toString(),
      name: createdPartner.name,
      email: createdPartner.email,
      restaurantName: createdPartner.restaurantName,
      phone: createdPartner.phone,
      address: createdPartner.address,
      userType: 'partner',
    },
    tokens,
  };
};

export const loginPartner = async (
  payload: FoodPartnerLogin
): Promise<{ profile: PartnerResponse; tokens: AuthTokens }> => {
  const partner = await findPartnerByEmail(payload.email);
  if (!partner) {
    throw new AuthError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(payload.password, partner.password);
  if (!isMatch) {
    throw new AuthError('Invalid credentials');
  }

  await revokeAllRefreshTokensForUserRepo(partner._id.toString(), 'partner');

  const tokenPayload: AuthTokenPayload = {
    Id: partner._id.toString(),
    email: partner.email,
    type: 'partner',
  };
  const tokens = await issueTokens(tokenPayload);

  return {
    profile: {
      id: partner._id.toString(),
      name: partner.name,
      email: partner.email,
      restaurantName: partner.restaurantName,
      phone: partner.phone,
      address: partner.address,
      userType: 'partner',
    },
    tokens,
  };
};

export const rotateRefreshToken = async (
  refreshToken: string
): Promise<{ tokens: AuthTokens; payload: AuthTokenPayload }> => {
  let decoded: AuthTokenPayload;
  try {
    decoded = jwt.verify(refreshToken, getRefreshSecret()) as AuthTokenPayload;
  } catch (error) {
    throw new AuthError('Invalid refresh token');
  }

  const tokenHash = hashToken(refreshToken);

  const tokenRecord = await findActiveRefreshToken(tokenHash);
  if (!tokenRecord) {
    throw new AuthError('Invalid refresh token');
  }

  if (new Date(tokenRecord.expiresAt).getTime() < Date.now()) {
    await revokeRefreshTokenByHash(tokenHash);
    throw new AuthError('Refresh token expired');
  }

  await revokeRefreshTokenByHash(tokenHash);

  const payload: AuthTokenPayload = {
    Id: decoded.Id,
    email: decoded.email,
    type: decoded.type,
  };

  const tokens = await issueTokens(payload);
  return { tokens, payload };
};

export const getAuthMeData = async (payload: AuthTokenPayload): Promise<Record<string, unknown>> => {
  if (payload.type === 'partner') {
    const partner = await findPartnerById(payload.Id);
    if (!partner) {
      throw new AuthError('Invalid token');
    }

    // Only return lightweight core session essentials
    return {
      message: 'User found',
      id: partner._id.toString(),
      name: partner.name,
      email: partner.email,
      userType: 'partner',
      restaurantName: partner.restaurantName,
    };
  }

  const user = await findUserById(payload.Id);
  if (!user) {
    throw new AuthError('Invalid token');
  }

  // Only return lightweight core session essentials
  return {
    message: 'User found',
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    userType: 'user',
  };
};

export const getAuthMeDataLightweight = async (payload: AuthTokenPayload): Promise<Record<string, unknown>> => {
  // Lightweight existence check instead of full document fetch
  const exists = payload.type === 'partner' 
    ? await partnerExists(payload.Id)
    : await userExists(payload.Id);

  if (!exists) {
    throw new AuthError('Invalid token - user account no longer exists');
  }

  // Return JWT data directly (no additional DB fetch needed)
  return {
    message: 'User found',
    id: payload.Id,
    email: payload.email,
    userType: payload.type,
  };
};

export const revokeAllRefreshTokensForUser = async (
  userId: string,
  userType: 'user' | 'partner'
): Promise<void> => {
  await revokeAllRefreshTokensForUserRepo(userId, userType);
};
