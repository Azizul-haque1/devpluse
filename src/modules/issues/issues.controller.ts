import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { IJwtPayload, IUser } from "../auth/auth.interface";
import sendResponse from "../../utility/sendResponse";
import type { TIssueSort } from "./issues.interface";

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

const getAllIssues = async (req: Request, res: Response) => {
  const sort = (req.query.sort as TIssueSort) || "newest";
  try {
    const result = await issuesService.getAllIssuesFromDB(sort);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
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

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const id: number = Number(req.params.id);
    const result = await issuesService.getSingleIssueFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
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

const updateIssue = async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  try {
    const result = await issuesService.updateIssueFromDB(
      id,
      req.user!,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
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

export const issuesController = {
  createIssues,
  getAllIssues,
  getSingleIssue,
  updateIssue,
};
