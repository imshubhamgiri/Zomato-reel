import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import type { ApiResponse , ErrorResponse } from '../types';
import jwt from  'jsonwebtoken';
import User from '../models/userModel';
import { FoodPartner } from '../models/foodPartner.model';

interface ProfileRegister{
    name:string;
    email:string;
    password:string;
}
interface UserLogin{
    email:string;
    password:string;
}
interface FoodPartnerRegister{
    name:string;
    email:string;
    password:string;
    restaurantName:string;
    phone:string;
    address:string;
}
interface PartnerResponse{
    id: string;
    name:string;
    email:string;
    restaurantName:string;
    phone:string;
    address:string;
}
interface FoodPartnerLogin{
    email:string;
    password:string;
}

interface ProfileResponse {
    id: string;
    name: string;
    email: string;
}

export const register = async (
  req: Request<{}, {}, ProfileRegister>,
  res: Response<ApiResponse<ProfileResponse> | ErrorResponse>
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign(
      { Id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 86400000, // 1 day
    });

    const profileResponse: ProfileResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: profileResponse,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
        error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};



// authController.register = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const existingUser = await User.findOne({ email }).lean();
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists' });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ name, email, password: hashedPassword });
//         await newUser.save();
//         const token = jwt.sign({ Id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
//         res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 86400000 }); // 1 day
//         res.status(201).json({ 
//             user: { id: newUser._id.toString(), name: newUser.name, email: newUser.email },
//             message: 'User registered successfully' 
//         });
//     }
//     catch (error) {
//         console.error('Register error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// authController.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email }).lean();     
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ Id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
//         res.cookie("token", token, { httpOnly: true, secure: false, maxAge: 86400000 }); // 1 day
//         res.status(200).json({ 
//             user: { id: user._id, name: user.name, email: user.email },
//             message: 'Login successful'
//          });
//     }
//     catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

export const login = async (
  req: Request<{}, {}, UserLogin>,
  res: Response<ApiResponse<ProfileResponse>>
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email}).lean();     
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    const token = jwt.sign({Id: user._id}, process.env.JWT_SECRET as string, {expiresIn: "24h"});
    res.cookie("token", token, {httpOnly: true, secure: false, maxAge: 86400000}); // 1 day
    const profileResponse: ProfileResponse = {
      id: user._id.toString(),
      name: user.name,
        email: user.email,
    };
    res.status(200).json({
        success: true,
        message: "Login successful",
        user: profileResponse,
    })
}catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export const logoutuser = (_req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ message: 'Logout successful' });
}

export const registerFoodPartner = async (
    req: Request<{}, {}, FoodPartnerRegister>,
    res: Response<ApiResponse<PartnerResponse> | ErrorResponse>
): Promise<void> => {
    const { name, email, password , restaurantName, phone , address } = req.body;
    try {
        
        const existing = await FoodPartner.findOne({email}).lean()
        if(existing){
             res.status(400).json({
                 success: false,
                 message: 'Email already exists',
                 });
                 return;
        }
         
         const hashedPassword = await bcrypt.hash(password , 10);
       const newUser = new FoodPartner({ name, email, restaurantName, phone,address, password: hashedPassword });
         await newUser.save();
        const token = jwt.sign(
            {Id:newUser._id},
            process.env.JWT_SECRET as string,
            {expiresIn:'1h'}
        )
        res.cookie('token',token , {httpOnly: true, secure: false, maxAge: 3600000}); // 1 hour
       
        const Profiledata: PartnerResponse = {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            restaurantName: newUser.restaurantName,
            phone: newUser.phone,
            address: newUser.address,
        }

        res.status(201).json({
        success: true,
        message:"Registration successful",
        user: Profiledata
       });
       return;
    } catch (error) {
        console.log('Registration error', error)
        res.status(500).json({
          success:false,
          message:"server error",
          error: error instanceof Error ? error.message : "Unknown error"
        })
    }

}

export const loginFoodPartner = async (req: Request<{}, {}, FoodPartnerLogin>, res: Response<ApiResponse<PartnerResponse> | ErrorResponse>): Promise<void> => {
    // Implementation for food partner registration
    const { email, password } = req.body;
    // Similar logic as user registration can be applied here
    try {
        
        const existing = await FoodPartner.findOne({email}).lean()
        if(!existing){
           res.status(400).json({success: false, message:"invalid credential"})
            return;
        } 
       const isMatch = await bcrypt.compare(password, existing.password);
       if(!isMatch){
          res.status(400).json({success: false, message:"invalid credential"})
          return;
       }
        const token = jwt.sign(
            {Id:existing._id},
            process.env.JWT_SECRET as string,
            {expiresIn:'1h'}
        )
        res.cookie('token',token , {httpOnly: true, secure: false, maxAge: 3600000}); // 1 hour
        
        const profileResponse: PartnerResponse = {
            id: existing._id.toString(),
            name: existing.name,
            email: existing.email,
            restaurantName: existing.restaurantName,
            phone: existing.phone,
            address: existing.address,
        }

        res.status(200).json({
        success: true,
        message:"login successful",
        user: profileResponse});
        return;
    } catch (error) {
        res.status(500).json({
          success:false,
          message:"server error",
          error: error instanceof Error ? error.message : "Unknown error"})
    }

}

export const logoutFoodpartner = (_req: Request, res: Response<ApiResponse>) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
       message: 'FoodPartner Logged out successfully' 
      });
}
