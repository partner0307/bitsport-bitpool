import { model, Schema } from "mongoose";
import mongoose from 'mongoose';
import { IHistory } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const Withdraw_historySchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true },
},{ timestamps: true });

/**
 * IHistory Interface Document class inheritance
 */
export default model<IHistory>("Withdraw_history", Withdraw_historySchema);
