import type { Request, Response } from "express";
import { issuesService } from "./issues.service";

const createIssues = async (req: Request, res: Response) => {
  try {
    const result = await issuesService.createIssuesIntoDB(req.body);
  } catch (error) {}
};

export const issuesController = {
  createIssues,
};
