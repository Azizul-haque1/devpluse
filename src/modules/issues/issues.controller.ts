import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { IJwtPayload, IUser } from "../auth/auth.interface";
import sendResponse from "../../utility/sendResponse";

const createIssues = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const result = await issuesService.createIssuesIntoDB(user!.id, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
    console.log(result);
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const issuesController = {
  createIssues,
};
