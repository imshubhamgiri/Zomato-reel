import { Request, Response } from 'express';
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



export const register = async (
  req: Request<{}, {}, ProfileRegister>,
  res: Response<ApiResponse<ProfileResponse> | ErrorResponse>
): Promise<void> => {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = message === 'User already exists' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? 'User already exists' : 'Server error',
      error: message,
    });
  }
};


export const login = async (
  req: Request<{}, {}, UserLogin>,
  res: Response<ApiResponse<ProfileResponse | ErrorResponse>>
): Promise<void> => {
  try {
    const { profile, tokens } = await loginUser(req.body);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: profile,
        tokens,
    })
}catch (error) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const statusCode = message === 'Invalid credentials' ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: statusCode === 400 ? 'Invalid credentials' : 'Server error',
      error: message,
    });
  }
}

export const logoutuser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user) {
      await revokeAllRefreshTokensForUser(req.user.id, req.user.type);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

export const registerFoodPartner = async (
    req: Request<{}, {}, FoodPartnerRegister>,
    res: Response<ApiResponse<PartnerResponse> | ErrorResponse>
): Promise<void> => {
    try {
      const { profile, tokens } = await registerPartner(req.body);

      res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
      res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
      res.cookie('token', tokens.accessToken, getAccessCookieOptions());

        res.status(201).json({
        success: true,
        message:'Registration successful',
        user: profile,
        tokens,
       });
       return;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = message === 'Email already exists' ? 400 : 500;
        res.status(statusCode).json({
          success:false,
          message: statusCode === 400 ? 'Email already exists' : 'server error',
          error: message,
        })
    }

}

export const loginFoodPartner = async (req: Request<{}, {}, FoodPartnerLogin>, res: Response<ApiResponse<PartnerResponse> | ErrorResponse>): Promise<void> => {
    try {
      const { profile, tokens } = await loginPartner(req.body);

      res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
      res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
      res.cookie('token', tokens.accessToken, getAccessCookieOptions());

        res.status(200).json({
        success: true,
        message:'login successful',
        user: profile,
        tokens,
      });
        return;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = message === 'Invalid credentials' ? 400 : 500;
        res.status(statusCode).json({
          success:false,
          message: statusCode === 400 ? 'invalid credential' : 'server error',
          error: message,
        })
    }

}

export const logoutFoodpartner = async (req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> => {
    if (req.user) {
      await revokeAllRefreshTokensForUser(req.user.id, req.user.type);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('token');
    res.status(200).json({
        success: true,
       message: 'FoodPartner Logged out successfully' 
      });
}

export const refreshToken = async (req: Request, res: Response<ApiResponse | ErrorResponse>): Promise<void> => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    res.status(401).json({
      success: false,
      message: 'Refresh token is required',
      error: 'Missing refresh token',
    });
    return;
  }

  try {
    const { tokens } = await rotateRefreshToken(incomingRefreshToken);

    res.cookie('accessToken', tokens.accessToken, getAccessCookieOptions());
    res.cookie('refreshToken', tokens.refreshToken, getRefreshCookieOptions());
    res.cookie('token', tokens.accessToken, getAccessCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const loginCheck = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Please Login First' });
    return;
  }

  try {
    const responseData = await getLoginCheckData({
      Id: req.user.id,
      email: req.user.email,
      type: req.user.type,
    });
    res.status(200).json(responseData);
  } catch (error) {
    res.status(401).json({
      message: 'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
    });
  }
};
