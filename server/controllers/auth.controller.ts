import fs from "fs";
import bcrypt from "bcrypt";
import path from 'path';
import { Request, Response } from "express";
import User from "../models/User";
import nodemailer from 'nodemailer';
import handlebars from "handlebars";


import { generateToken } from "../service/helpers";
import { USER_EMAIL, USER_PASSWORD } from '../config';
import { getEtherPrivateKeyAndWalletAddress } from '../service/wallet/ethers';
import { getBTCPrivateKeyAndWalletAddress } from '../service/wallet/bitcoin';
import { getTronPrivateKeyAndWalletAddress } from '../service/wallet/tron';

/**
 * User registration function
 * @param req
 * @param res
 * @returns
 */
export const SignUp = async ( req: Request, res: Response ) => {
  if (!req.body.email || !req.body.password) {
    return res.json({ success: false, message: "Please, send your email and password." });
  }

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.json({ success: false, message: "User already exixts!" });
  }

  const ether = getEtherPrivateKeyAndWalletAddress();
  const btc = getBTCPrivateKeyAndWalletAddress();
  const tron = getTronPrivateKeyAndWalletAddress();

  const newUser = new User({
    firstname: req.body.first_name,
    lastname: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    money: { busd: 0, usdt: 0, usd: 0, bitp: 0, quest: 0 },
    address: {
      ether: { privateKey: ether.privateKey, address: ether.address },
      bitcoin: { privateKey: btc.privateKey, address: btc.address },
      tron: { privateKey: (await tron).privateKey, address: (await tron).address }
    }
  });
  // await newUser.save();

  // const transfer = nodemailer.createTransport({
  //   host: 'email-smtp.us-west-1.amazonaws.com',
  //   port: 587,
  //   auth: {
  //     user: USER_EMAIL,
  //     pass: USER_PASSWORD
  //   },
  //   secure: false,
  //   requireTLS: true,
  //   from: "welcome@bitsport.gg"
  // });
  // const templatePath = path.resolve('../server/template');
  // const templateFile = await fs.readFileSync(templatePath + "/welcome.hbs", "utf8");
  // const template = handlebars.compile(templateFile);
  // let data = { username: req.body.username };
  // let html = template(data);

  // transfer.sendMail({
  //   from: `Bitsports <welcome@bitsport.gg>`,
  //   to: `${req.body.email}`,
  //   subject: `Success to receive from ${newUser.firstname} ${newUser.lastname}!`,
  //   html
  // }, (err, data) => {
  //   if(err) res.json({ success: false, message: 'Sorry! Request has an error!' });
    // else 
    res.json({ success: true, token: generateToken(newUser) });
  // });
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
