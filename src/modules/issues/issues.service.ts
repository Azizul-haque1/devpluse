import { pool } from "../../db";
import type { ICreateIssue } from "./issues.interface";

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

export const issuesService = {
  createIssuesIntoDB,
};
