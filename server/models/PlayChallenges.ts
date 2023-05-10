import mongoose, { model, Schema } from "mongoose";
import { IPlayChallenge } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const PlayChallengeSchema = new Schema({
    user_id: { type: String, required: true },
    challenge_id: { type: mongoose.Types.ObjectId, ref: 'Challenge', required: true },
    current_match: { type: Number, required: true, trim: true, default: 0 },
    win_match: { type: Number, required: true, trim: true, default: 0 },
    loss_match: { type: Number, required: true, trim: true, default: 0 },
    tot_match: { type: Number, required: true, trim: true, default: 0 },
    won_challenge: { type: Number, required: true, trim: true, default: 0 },
    status: { type: Number, required: true, trim: true, default: 0 }
},{ timestamps: true });

/**
 * IPlayCHallenge Interface Document class inheritance
 */
export default model<IPlayChallenge>("PlayChallenge", PlayChallengeSchema);
