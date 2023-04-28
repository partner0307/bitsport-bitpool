import { Document } from "mongoose";

/**
 * IChallenge Interface
 * Document class inheritance
 */
export interface IChallenge extends Document {
  title: string;
  difficalty: number;
  streak: number;
  amount: number;
  qc: number;
  coin_sku: string;
  status: number;
}
