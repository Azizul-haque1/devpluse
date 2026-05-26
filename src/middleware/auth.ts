import type { NextFunction, Request, Response } from "express";
import type { IJwtPayload, TRole } from "../modules/auth/auth.interface";
import sendResponse from "../utility/sendResponse";
import jwt from "jsonwebtoken";
import config from "../config";

const auth = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("Unauthorized");
      }
      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as IJwtPayload;

      if (roles.length && !roles.includes(decoded.role)) {
        throw new Error("Forbidden");
      }

      req.user = decoded;
      //   console.log(req.user);
      next();
    } catch (error: any) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
// ole.log("decoded", decoded);
