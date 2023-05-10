import { Request, Response } from 'express';
import Axios from 'axios';
import moment from 'moment';
import Web3 from 'web3';
import User from '../models/User';
import History from '../models/Withdraw_history';
import {
    ETHEREUM, BNBCHAIN, TRON,
    BUSD_TOKEN_ADDRESS_BNB, BUSD_TOKEN_ADDRESS_ETH, BUSD_TOKEN_ADDRESS_TRON,
    USDT_TOKEN_ADDRESS_BNB, USDT_TOKEN_ADDRESS_ETH, USDT_TOKEN_ADDRESS_TRON,
    CAKE_TOKEN_ADDRESS_BNB, CAKE_TOKEN_ADDRESS_ETH, CAKE_TOKEN_ADDRESS_TRON,
    ETHEREUM_TRANSACTION, BNBCHAIN_TRANSACTION, TRON_TRANSACTION,
    INFURA_URL
} from '../config';
import { generateToken } from '../service/helpers';
const ContractAbi = require('../service/contractApi');

export const deposit = async (req: Request, res: Response) => {
    User.findById(req.body.user).then((user: any) => {
        if(user) {
            if(req.body.network === ETHEREUM) {
                // const filter_address = user.address.ether.address;
                const filter_address = '0x8396Cf380b556fFA3B4025530bB03aaf09bd5C2F';
                const coin_address = req.body.coin === 'BUSD' ? BUSD_TOKEN_ADDRESS_ETH : req.body.coin === 'USDT' ? USDT_TOKEN_ADDRESS_ETH : CAKE_TOKEN_ADDRESS_ETH;
                const config_url = `api?module=account&action=tokentx&contractaddress=${coin_address}&address=${filter_address}&page=1&offset=10&startblock=0&endblock=99999999&sort=desc&apikey=ABUVDNYMXVENVGYN3FY4BYFEFHB6Y2P1JK`;
                Axios.get(`${ETHEREUM_TRANSACTION}/${config_url}`).then(result => {
                    if(result.data.status === '0') {
                        res.json({ success: false, message: result.data.message });
                    }
                    else if(result.data.status === '1') {
                        if(req.body.coin === 'BUSD') {
                            user.money.busd += result.data.result[0].value / Math.pow(10, result.data.result[0].tokenDecimal);
                        }
                        else if(req.body.coin === 'USDT') {
                            user.money.usdt += result.data.result[0].value / Math.pow(10, result.data.result[0].tokenDecimal);
                        }
                        else if(req.body.coin === 'BITP') {
                            user.money.bitp += result.data.result[0].value / Math.pow(10, result.data.result[0].tokenDecimal);
                        }
                        const temp = result.data.result.map((p: any, i: number) => { return { _id: i + 1, amount: (p.value / Math.pow(10, p.tokenDecimal)), address: p.from, date: moment(new Date(Number(p.timeStamp))).format('YYYY-MM-DD'), coin: p.tokenSymbol } });
                        res.json({ success: true, model: temp, user, token: generateToken(user) });
                    }
                });
            }
            else if(req.body.network === BNBCHAIN) {
                // const filter_address = user.address.ether.address;
                const filter_address = '0x8396Cf380b556fFA3B4025530bB03aaf09bd5C2F';
                const coin_address = req.body.coin === 'BUSD' ? BUSD_TOKEN_ADDRESS_BNB : req.body.coin === 'USDT' ? USDT_TOKEN_ADDRESS_BNB : CAKE_TOKEN_ADDRESS_BNB;
                const config_url = `api?module=account&action=tokentx&contractaddress=${coin_address}&address=${filter_address}&startblock=0&endblock=999999999&page=1&offset=100&sort=desc&apikey=IHX3A7GFSDN8EFQCK2PA2DAZF8K9BW37M9`;
                
                Axios.get(`${BNBCHAIN_TRANSACTION}/${config_url}`).then(result => {
                    if(result.data.status === '0') {
                        res.json({ success: false, message: result.data.message });
                    }
                    else if(result.data.status === '1') {
                        if(req.body.coin === 'BUSD') {
                            user.money.busd += result.data.result[0].value / Math.pow(10, result.data.result[0].tokenDecimal);
                        }
                        else if(req.body.coin === 'USDT') {
                            user.money.usdt += result.data.result[0].value / Math.pow(10, result.data.result[0].tokenDecimal);
                        }
                        else if(req.body.coin === 'BITP') {
                            user.money.bitp += result.data.result[0].value / Math.pow(10, result.data.result[0].tokenDecimal);
                        }
                        const temp = result.data.result.map((p: any, i: number) => { return { _id: i + 1, amount: (p.value / Math.pow(10, p.tokenDecimal)), address: p.from, date: moment(new Date(Number(p.timeStamp))).format('YYYY-MM-DD'), coin: p.tokenSymbol } });
                        res.json({ success: true, model: temp, user, token: generateToken(user) });
                    }
                });
            }
            else if(req.body.network === 'TRON') {
                // const filter_address = user.address.tron.address;
                const filter_address = 'TLdZs7erUzBy2eKcdMXqeCKbGXAYF8rz89';
                const coin_address = req.body.coin === 'BUSD' ? BUSD_TOKEN_ADDRESS_TRON : req.body.coin === 'USDT' ? USDT_TOKEN_ADDRESS_TRON : CAKE_TOKEN_ADDRESS_TRON;
                const config_url = `v1/accounts/${filter_address}/transactions/trc20?limit=100&contract_address=${coin_address}`;
                Axios.get(`${TRON_TRANSACTION}/${config_url}`).then(result => {
                    if(!result.data.success) {
                        res.json({ success: false, message: result.data.message });
                    }
                    else if(result.data.status) {
                        if(req.body.coin === 'BUSD') {
                            user.money.busd += result.data.result[0].value / Math.pow(10, result.data.result[0].token_info.decimals);
                        }
                        else if(req.body.coin === 'USDT') {
                            user.money.usdt += result.data.result[0].value / Math.pow(10, result.data.result[0].token_info.decimals);
                        }
                        else if(req.body.coin === 'BITP') {
                            user.money.bitp += result.data.result[0].value / Math.pow(10, result.data.result[0].token_info.decimals);
                        }
                        const temp = result.data.data.map((p: any, i: number) => { return { _id: i + 1, amount: (p.value / Math.pow(10, p.token_info.decimals)), address: p.from, date: moment(new Date(Number(p.block_timestamp))).format('YYYY-MM-DD'), coin: p.token_info.symbol } });
                        res.json({ success: true, model: temp, user, token: generateToken(user) });
                    }
                });
            }
        }
    });
}

export const withdraw_index = (req: Request, res: Response) => {
    History.find({ user: req.body.user }).then((model: any) => {
        res.json({ model });
    })
}

export const withdraw = async (req: Request, res: Response) => {
    const web3 = new Web3(INFURA_URL);
    User.findById(req.body.user).then((model: any) => {
        if(model) {
            let privateKey = '', publicKey = '', coin_address = '';
            if(req.body.network === 'ETHEREUM') {
                privateKey = model.address.ether.privateKey;
                publicKey = model.address.ether.address;
                coin_address = req.body.coin === 'BUSD' ? BUSD_TOKEN_ADDRESS_ETH : req.body.coin === 'USDT' ? USDT_TOKEN_ADDRESS_ETH : CAKE_TOKEN_ADDRESS_ETH;
            }
            else if(req.body.network === 'BNB CHAIN') {
                privateKey = model.address.bitcoin.privateKey;
                publicKey = model.address.bitcoin.address;
                coin_address = req.body.coin === 'BUSD' ? BUSD_TOKEN_ADDRESS_BNB : req.body.coin === 'USDT' ? USDT_TOKEN_ADDRESS_BNB : CAKE_TOKEN_ADDRESS_BNB;
            }
            else if(req.body.networ === 'TRON') {
                privateKey = model.address.tron.privateKey;
                publicKey = model.address.tron.address;
                coin_address = req.body.coin === 'BUSD' ? BUSD_TOKEN_ADDRESS_TRON : req.body.coin === 'USDT' ? USDT_TOKEN_ADDRESS_TRON : CAKE_TOKEN_ADDRESS_TRON;
            }
            web3.eth.accounts.wallet.add(privateKey);
            var tokenAddress = coin_address;
            var fromAddress = publicKey;
            var tokenInst = new web3.eth.Contract(ContractAbi, tokenAddress);

            tokenInst.methods
                .transfer(req.body.address, req.body.amount)
                .send({ from: fromAddress, gas: 100000 }, function (error: any, result: any) {
                    if (!error) {
                        if(req.body.coin === 'BUSD') {
                            model.money.busd -= req.body.amount;
                        }
                        else if(req.body.coin === 'USDT') {
                            model.money.usdt -= req.body.amount;
                        }
                        else if(req.body.coin === 'BITP') {
                            model.money.bitp -= req.body.amount;
                        }
                        model.save().then((err: any) => {
                            const history_model = new History;
                            history_model.user = model._id;
                            history_model.coin = req.body.coin;
                            history_model.amount = req.body.amount;
                            history_model.address = req.body.address;
                            history_model.save().then(err => {
                                History.find({ user: model._id }).then((histories: any) => {
                                    tokenInst.methods
                                        .balanceOf(req.body.address)
                                        .call()
                                        .then((balance: any) => {
                                            res.json({ success: true, model, balance, token: generateToken(model), history: histories });
                                        })
                                        .catch(console.error);
                                    })
                                });
                            });
                    } else {
                        console.log(error);
                        web3.eth.getBalance(fromAddress, (err, bal) => {
                            console.log(
                            "Your account has " +
                                web3.utils.fromWei(bal, "ether") +
                                ", Insufficient funds for gas * price + value on your wallet"
                            );
                        });
                    }
                });
        }
    });
}

export const swap = async (req: Request, res: Response) => {}