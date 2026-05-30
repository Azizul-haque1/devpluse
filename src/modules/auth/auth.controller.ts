import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import config from "../../config";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { token, user } = await authService.loginUserFromDB(req.body);

    res.cookie("token", token, {
      secure: config.secure,
      httpOnly: true,
      sameSite: config.sameSite,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: { token, user },
    });

    // console.log(result);
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      data: error,
    });
  }
};

export const authController = {
  createUser,
  loginUser,
};
