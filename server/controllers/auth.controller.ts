import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import nodemailer from 'nodemailer';
import path from 'path';
import * as exphbs from 'express-handlebars';
import nodemailerExpressHandlebars from 'nodemailer-express-handlebars'

import { generateToken } from "../service/helpers";
import { getEtherPrivateKeyAndWalletAddress } from '../service/wallet/ethers';
import { getBTCPrivateKeyAndWalletAddress } from '../service/wallet/bitcoin';
import { getTronPrivateKeyAndWalletAddress } from '../service/wallet/tron';

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: '',
});

const handlebarOptions = {
  viewEngine: hbs,
  viewPath: path.resolve("../server/template/"),
  extName: ".hbs",
}

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
  await newUser.save();

  const transfer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD
    }
  });
  transfer.use('compile', nodemailerExpressHandlebars(handlebarOptions));
  transfer.sendMail({
    to: 'giantb2st0629@gmail.com',
    from: 'giantb2st0629@gmail.com',
    replyTo: req.body.email,
    subject: `Hello from ${newUser.firstname} ${newUser.lastname}`,
    // @ts-ignore-next-line
    template: 'welcome'
  })
  
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
