export type TRole = "contributor" | "maintainer";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: TRole;
}
export interface ILoginUser {
  email: string;
  password: string;
}

export interface IJwtPayload {
  id: number;
  name: string;
  email: string;
  role: TRole;
}
