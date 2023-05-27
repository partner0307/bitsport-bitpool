import mongoose, { model, Schema } from "mongoose";
import { IPlayedChallenge } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const PlayedChallengeSchema = new Schema({
    user_id: { type: Number, required: true },
    challenge_id: { type: Number, required: true },
    start_match: { type: String, required: true, trim: true },
    end_match: { type: String, required: true, trim: true },
    winorloss: { type: String, required: true, trim: true },
    status: { type: Number },
    index: { type: Number, required: true, default: 0 }
},{ timestamps: true });

/**
 * ICHallenge Interface Document class inheritance
 */
export default model<IPlayedChallenge>("PlayedChallenge", PlayedChallengeSchema);
