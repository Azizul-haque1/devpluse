import bcrypt from "bcrypt";
import config from "../../config";
import type { ILoginUser, IUser } from "./auth.interface";
import { pool } from "../../db";
import jwt from "jsonwebtoken";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  //   console.log("payload", payload);

  const hashPassword = await bcrypt.hash(password, Number(config.salt_round));
  // console.log("has", hashPassword);

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

const loginUserFromDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const query = `
  SELECT * FROM users WHERE email=$1
  `;
  const value = [email];

  const userData = await pool.query(query, value);

  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials!");
  }

  const user = userData.rows[0];

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  delete user.password;
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "1d",
  });

  return { token, user };
};

export const authService = {
  createUserIntoDB,
  loginUserFromDB,
};
