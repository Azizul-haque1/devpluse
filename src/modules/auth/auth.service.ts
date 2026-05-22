import bcrypt from "bcrypt";
import config from "../../config";
import { pool } from "../../db";
import type { IUser } from "./user/user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  //   console.log("payload", payload);

  const hashPassword = await bcrypt.hash(password, Number(config.salt_round));
  console.log("has", hashPassword);

  const query = `
  INSERT INTO users(name, email, password, role)
  VALUES($1, $2, $3, $4)
  RETURNING id, name, email, role, created_at, updated_at

  `;

  const values = [name, email, hashPassword, role || "contributor"];
  const result = await pool.query(query, values);
  //   console.log("result", result);
  return result.rows[0];
};

export const authService = {
  createUserIntoDB,
};
