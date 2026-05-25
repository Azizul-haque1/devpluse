import { pool } from "../../db";
import type { IUser } from "../auth/auth.interface";
import type { ICreateIssue, IIssue, TIssueSort } from "./issues.interface";

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

const getAllIssuesFromDB = async (sort: TIssueSort = "newest") => {
  let orderBy = "DESC";

  if (sort === "oldest") {
    orderBy = "ASC";
  }
  const usersData = await pool.query(
    `
    SELECT * FROM users
    `
  );
  const users = usersData.rows;

  const query = `
  SELECT * FROM issues
  ORDER BY created_at ${orderBy}
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

const getSingleIssueFromDB = async (id: number) => {
  const issueQuery = `
  SELECT * FROM issues WHERE id=$1 
  `;
  const issueResult = await pool.query(issueQuery, [id]);

  const issue = issueResult.rows[0];

  if (!issue) {
    throw new Error("Issue not found");
  }

  const userQuery = `
  SELECT * FROM users WHERE id=$1`;
  const userResult = await pool.query(userQuery, [issue.reporter_id]);
  const reporter = userResult.rows[0];

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
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
