import { Document } from "mongoose";

/**
 * IUser Interface
 * Document class inheritance
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  money: {
    usdt: number;
    busd: number;
    quest: number;
    bitp: number;
    usd: number;
  };
}
