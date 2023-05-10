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
    description: string;
    streak: number;
    amount: number;
    qc: number;
    coin_sku: string;
    loss_back: string;
    status: number;
}


export interface IPlayChallenge extends Document {
    user_id: string;
    challenge_id: string;
    current_match: string;
    win_match: string;
    loss_match: string;
    tot_match: string;
    won_challenge: string;
    status: string;
}

export interface IPlayedChallenge extends Document {
    user_id: string;
    challenge_id: string;
    start_match: string;
    end_match: string;
    winorloss: string;
    status: number;
}

export interface IHistory extends Document {
    user: string,
    coin: string,
    amount: number,
    address: string
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