import mongoose, { model, Schema } from "mongoose";
import { ITransaction } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const TransactionSchema = new Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    coin: { type: Number, required: true },
    amount: { type: Number, required: true },
    address: { type: String, required: true }
},{ timestamps: true });

/**
 * ITransaction Interface Document class inheritance
 */
export default model<ITransaction>("Transaction", TransactionSchema);
