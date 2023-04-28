import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

import { generateToken } from "../service/helpers";

/**
 * User registration function
 * @param req
 * @param res
 * @returns
 */
export const SignUp = async ( req: Request, res: Response ): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.json({ success: false, message: "Please, send your email and password." });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.json({ success: false, message: "User already exixts!" });
  }

  const newUser = new User({
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    money: { busd: 0, usdt: 0, usd: 0, bitp: 0, quest: 0 },
  });
  await newUser.save();
  return res.json({ success: true, token: generateToken(newUser) });
};

/**
 * User login function
 * @param req
 * @param res
 * @returns
 */
export const SignIn = async (req: Request, res: Response): Promise<Response> => {
  if (!req.body.email || !req.body.password) {
    return res.json({ success: false, message: "No Input Data!" });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.json({ success: false, message: "User does not exists!" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (isMatch) {
    return res.json({ success: true, token: generateToken(user) });
  }

  return res.json({ success: false, message: "The email or password are incorrect!" });
};
