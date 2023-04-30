import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../service/interfaces";

/**
 * Create a new Schema from mongoose
 */
const UserSchema = new Schema({
  username: { type: String, minlength: 4, required: true },
  email: { type: String, unique: true, trim: true, lowercase: true, required: true },
  password: { type: String, minlength: 6, required: true },
  firstname: { type: String, required: true, minlength: 4 },
  lastname: { type: String, required: true, minlength: 4 },
  money: {
    busd: { type: Number, required: true },
    usdt: { type: Number, required: true },
    usd: { type: Number, required: true },
    bitp: { type: Number, required: true },
    quest: { type: Number, required: true },
  },
  address: {
    ether: {
      privateKey: { type: String, required: true },
      address: { type: String, required: true }
    },
    bitcoin: {
      privateKey: { type: String, required: true },
      address: { type: String, required: true }
    },
    tron: {
      privateKey: { type: String, required: true },
      address: { type: String, required: true }
    }
  }
}, { timestamps: true });

/**
 * A promise to be either resolved with the encrypted data salt or rejected with an Error
 */
UserSchema.pre<IUser>("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

/**
 * IUser Interface Document class inheritance
 */
export default model<IUser>("User", UserSchema);
