import { Document } from "mongoose";

/**
 * IUser Interface
 * Document class inheritance
 */
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    money: {
        usdt: number;
        busd: number;
        quest: number;
        bitp: number;
        usd: number;
    };
    address: {
        ether: { privateKey: string, address: string },
        bitcoin: { privateKey: string, address: string },
        tron: { privateKey: string, address: string }
    }
}

/**
 * IChallenge Interface
 * Document class inheritance
 */
export interface IChallenge extends Document {
    title: string;
    difficalty: number;
    streak: number;
    amount: number;
    qc: number;
    coin_sku: string;
    status: number;
}

export interface ITransaction extends Document {
    coin: number;
    amount: number;
    address: string;
    user: string;
}

interface IResponse {
    [key: string]: any;
}

interface IWalletResponse {
    address: string | unknown;
    privateKey: string;
    publicKey?: string;
    mnemonic?: string;
    nonce?: number;
    seed?: string;
}

type IBalanceResponse = number | string;

export const response = (args: IResponse) => {
    return args;
}

export const walletResponse = (args: IWalletResponse) => {
    return args;
}

export const balanceResponse = (arg: IBalanceResponse) => {
    return arg;
}