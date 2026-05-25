import { pool } from "../../db";
import type { IUser } from "../auth/auth.interface";
import type { ICreateIssue, IIssue } from "./issues.interface";

const createIssuesIntoDB = async (id: number, payload: ICreateIssue) => {
  const { title, description, type } = payload;

  const query = `
  INSERT INTO issues(title, description, type, reporter_id)
  VALUES($1, $2, $3, $4)
  RETURNING *
  `;

  const values = [title, description, type, id];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllIssuesFromDB = async () => {
  const usersData = await pool.query(
    `
    SELECT * FROM users
    `
  );
  const users = usersData.rows;
  const query = `
  SELECT * FROM issues
  `;
  const issuesData = await pool.query(query);
  const issues = issuesData.rows;

  const formattedIssues = issues.map((issue: IIssue) => {
    const reporter = users.find((user: IUser) => user.id === issue.reporter_id);

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter: {
        id: reporter?.id,
        name: reporter?.name,
        role: reporter?.role,
      },
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });
  return formattedIssues;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
};
