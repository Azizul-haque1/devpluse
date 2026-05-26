import { pool } from "../../db";
import type { IJwtPayload, IUser } from "../auth/auth.interface";
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

const updateIssueFromDB = async (
  id: number,
  user: IJwtPayload,
  payload: ICreateIssue
) => {
  const query = `
  SELECT * FROM issues WHERE id=$1
  `;
  const issueResult = await pool.query(query, [id]);

  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }

  if (user.role === "contributor") {
    if (user.id !== issue.reporter_id) {
      throw new Error("Forbidden: Not your issue");
    }
    if (issue.status !== "open") {
      throw new Error("Cannot update non-open issue");
    }
  }

  // console.log(payload);
  const updatedTitle = payload.title || issue.title;
  const updatedDescription = payload.description || issue.description;
  const updatedType = payload.type || issue.type;

  const updateQuery = `
  UPDATE issues 
  SET title = $1,
      description =$2,
      type=$3,
      updated_at = NOW()
  WHERE id=$4
  RETURNING *
  `;

  const updateValues = [updatedTitle, updatedDescription, updatedType, id];

  const result = await pool.query(updateQuery, updateValues);
  const updatedIssue = result.rows[0];

  if (!updatedIssue) {
    throw new Error("Update failed");
  }

  const userResult = await pool.query(
    `
    SELECT id, name, role FROM users WHERE id =$1
    `,
    [updatedIssue.reporter_id]
  );

  const reporter = userResult.rows[0];

  return {
    id: updatedIssue.id,
    title: updatedIssue.title,
    description: updatedIssue.description,
    type: updatedIssue.type,
    status: updatedIssue.status,
    reporter,
    created_at: updatedIssue.created_at,
    updated_at: updatedIssue.updated_at,
  };
};

const deleteIssueFromDB = async (id: number) => {
  const issueResult = await pool.query(
    `  
    SELECT *  FROM issues WHERE id=$1`,
    [id]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }

  const deletedIssue = await pool.query(
    `
    DELETE FROM issues WHERE id=$1
    `,
    [id]
  );
  console.log(deletedIssue);
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB,
};
