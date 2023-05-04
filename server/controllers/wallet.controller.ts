import { Request, Response } from 'express';
import Axios from 'axios';
import moment from 'moment';
import User from '../models/User';
import {
    ETHEREUM, BNBCHAIN, TRON,
    BUSD_TOKEN_ADDRESS_BNB, BUSD_TOKEN_ADDRESS_ETH, BUSD_TOKEN_ADDRESS_TRON,
    USDT_TOKEN_ADDRESS_BNB, USDT_TOKEN_ADDRESS_ETH, USDT_TOKEN_ADDRESS_TRON,
    CAKE_TOKEN_ADDRESS_BNB, CAKE_TOKEN_ADDRESS_ETH, CAKE_TOKEN_ADDRESS_TRON,
    ETHEREUM_TRANSACTION, BNBCHAIN_TRANSACTION, TRON_TRANSACTION
} from '../config';

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
                        const temp = result.data.result.map((p: any) => { return { amount: (p.value / Math.pow(10, p.tokenDecimal)), address: p.from, date: moment(new Date(Number(p.timeStamp))).format('YYYY-MM-DD') } });
                        res.json({ success: true, model: temp });
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
                        const temp = result.data.result.map((p: any) => { return { amount: (p.value / Math.pow(10, p.tokenDecimal)), address: p.from, date: moment(new Date(Number(p.timeStamp))).format('YYYY-MM-DD') } });
                        res.json({ success: true, model: temp });
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
                        const temp = result.data.data.map((p: any) => { return { amount: (p.value / Math.pow(10, p.token_info.decimals)), address: p.from, date: moment(new Date(Number(p.block_timestamp))).format('YYYY-MM-DD') } });
                        res.json({ success: true, model: temp });
                    }
                });
            }
        }
    });
    
}

export const withdraw = async (req: Request, res: Response) => {}

export const swap = async (req: Request, res: Response) => {}