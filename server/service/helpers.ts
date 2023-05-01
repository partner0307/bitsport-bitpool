import JwtWebToken from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { IUser } from "../service/interfaces";

/**
 * Generate User Token Infomation by jsonwebtoken
 * @param user
 * @returns
 */

export const generateToken = (user: IUser) => {
  return JwtWebToken.sign(
    {
      id: user.id,
      email: user.email,
      address: {
        ether: { privateKey: user.address.ether.privateKey, address: user.address.ether.address },
        bitcoin: { privateKey: user.address.bitcoin.privateKey, address: user.address.bitcoin.address },
        tron: { privateKey: user.address.tron.privateKey, address: user.address.tron.address },
      },
      money: {
        usdt: user.money.usdt,
        busd: user.money.busd,
        quest: user.money.quest,
        bitp: user.money.bitp,
        usd: user.money.usd
      }
    },
    SECRET_KEY,
    {
      expiresIn: 60 * 60 * 24,
    }
  );
};
