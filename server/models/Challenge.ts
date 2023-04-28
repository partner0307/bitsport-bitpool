import { model, Schema } from "mongoose";
import { IChallenge } from "./Interfaces/IChallenge";

/**
 * Create a new Schema from mongoose
 */

const ChallengeSchema = new Schema({
    title: { type: String, required: true },
    difficalty: { type: Number, required: true },
    streak: { type: Number, required: true },
    amount: { type: String, required: true },
    qc: { type: String, required: true },
    coin_sku: { type: Number, required: true },
    status: { type: Number, required: true, default: 1 }
},{ timestamps: true });

/**
 * ICHallenge Interface Document class inheritance
 */
export default model<IChallenge>("Challenge", ChallengeSchema);
