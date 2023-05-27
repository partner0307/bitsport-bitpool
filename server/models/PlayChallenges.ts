import mongoose, { model, Schema } from "mongoose";
import { IPlayChallenge } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */

const PlayChallengeSchema = new Schema({
    user_id: { type: Number, required: true },
    challenge_id: { type: Number, required: true, default: 0 },
    current_match: { type: Number, required: true, trim: true, default: 0 },
    win_match: { type: Number, required: true, trim: true, default: 0 },
    loss_match: { type: Number, required: true, trim: true, default: 0 },
    tot_match: { type: Number, required: true, trim: true, default: 0 },
    wonchallenge: { type: Number, required: true, trim: true, default: 0 },
    status: { type: Number, required: true, trim: true, default: 0 },
    index: { type: Number, required: true, default: 0 }
},{ timestamps: true });

/**
 * IPlayCHallenge Interface Document class inheritance
 */
export default model<IPlayChallenge>("PlayChallenge", PlayChallengeSchema);
