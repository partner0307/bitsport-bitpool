import mongoose, { model, Schema } from "mongoose";
import { IPlayedChallenge } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const PlayedChallengeSchema = new Schema({
    user_id: { type: String, required: true },
    challenge_id: { type: mongoose.Types.ObjectId, ref: 'Challenge', required: true },
    start_match: { type: String, required: true, trim: true },
    end_match: { type: String, required: true, trim: true },
    winorloss: { type: String, required: true, trim: true },
    status: { type: Number, required: true }
},{ timestamps: true });

/**
 * ICHallenge Interface Document class inheritance
 */
export default model<IPlayedChallenge>("PlayedChallenge", PlayedChallengeSchema);
