import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import type {
  ApiResponse,
  ErrorResponse,
  ProfileRegister,
  ProfileResponse,
  FoodPartnerRegister,
  FoodPartnerLogin,
  UserLogin,
  PartnerResponse,
  AuthenticatedRequest,
} from '../types';
import {
  getAccessCookieOptions,
  getLoginCheckData,
  getRefreshCookieOptions,
  loginPartner,
  loginUser,
  registerPartner,
  registerUser,
  revokeAllRefreshTokensForUser,
  rotateRefreshToken,
} from '../services/auth.service';



export const register = asyncHandler(
  async (
    req: Request<{}, {}, ProfileRegister>,
    res: Response<ApiResponse<ProfileResponse> | ErrorResponse>
  ): Promise<void> => {
    const { profile, tokens } = await registerUser(req.body);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: profile,
      tokens,
    });
  }
);


export const login = asyncHandler(
  async (
    req: Request<{}, {}, UserLogin>,
    res: Response<ApiResponse<ProfileResponse | ErrorResponse>>
  ): Promise<void> => {
    const { profile, tokens } = await loginUser(req.body);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: profile,
      tokens,
    });
  }
);

export const logoutuser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user) {
      await revokeAllRefreshTokensForUser(req.user.id, req.user.type);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  }
);

export const registerFoodPartner = asyncHandler(
  async (
    req: Request<{}, {}, FoodPartnerRegister>,
    res: Response<ApiResponse<PartnerResponse> | ErrorResponse>
  ): Promise<void> => {
    const { profile, tokens } = await registerPartner(req.body);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: profile,
      tokens,
    });
  }
);

export const loginFoodPartner = asyncHandler(
  async (
    req: Request<{}, {}, FoodPartnerLogin>,
    res: Response<ApiResponse<PartnerResponse> | ErrorResponse>
  ): Promise<void> => {
    const { profile, tokens } = await loginPartner(req.body);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(200).json({
      success: true,
      message: 'login successful',
      user: profile,
      tokens,
    });
  }
);

export const logoutFoodpartner = asyncHandler(
  async (
    req: AuthenticatedRequest,
    res: Response<ApiResponse>
  ): Promise<void> => {
    if (req.user) {
      await revokeAllRefreshTokensForUser(req.user.id, req.user.type);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'FoodPartner Logged out successfully',
    });
  }
);

export const refreshToken = asyncHandler(
  async (
    req: Request,
    res: Response<ApiResponse | ErrorResponse>
  ): Promise<void> => {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      res.status(401).json({
        success: false,
        message: 'Refresh token is required',
        error: 'Missing refresh token',
      });
      return;
    }

    const { tokens } = await rotateRefreshToken(incomingRefreshToken);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: tokens,
    });
  }
);

export const loginCheck = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Please Login First' });
    return;
  }

  
    const responseData = await getLoginCheckData({
      Id: req.user.id,
      email: req.user.email,
      type: req.user.type,
    });
    res.status(200).json(responseData);
  
  // catch (error) {
  //   res.status(401).json({
  //     message: 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
  //   });
  // }
});
