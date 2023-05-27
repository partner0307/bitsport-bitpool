import { Request, Response, json } from "express";
import Axios from "axios";
import moment from "moment";
import Web3 from "web3";
import User from "../models/User";
import History from "../models/Withdraw_history";
const BigNumber = require("bignumber.js");
import dotenv from "dotenv";
dotenv.config();

import {
  ETHEREUM,
  BNBCHAIN,
  TRON,
  BUSD_TOKEN_ADDRESS_BNB,
  BUSD_TOKEN_ADDRESS_ETH,
  BUSD_TOKEN_ADDRESS_TRON,
  USDT_TOKEN_ADDRESS_BNB,
  USDT_TOKEN_ADDRESS_ETH,
  USDT_TOKEN_ADDRESS_TRON,
  CAKE_TOKEN_ADDRESS_BNB,
  CAKE_TOKEN_ADDRESS_ETH,
  CAKE_TOKEN_ADDRESS_TRON,
  ETHEREUM_TRANSACTION,
  BNBCHAIN_TRANSACTION,
  TRON_TRANSACTION,
  BSC_MAINNET_WEB3PROVIDER,
  ETH_MAINNET_WEB3PROVIDER,
  TRON_MAINNET_WEB3PROVIDER,
} from "../config";
import { generateToken } from "../service/helpers";

import contractApi from "../service/contractApi";
import { String } from "bitcoinjs-lib/src/types";
import { token } from "morgan";

export const getUserInfo = async (req: Request, res: Response) => {
  User.findById(req.body.user).then((user: any) => {
    if (user) {
      res.json({
        success: true,
        token: generateToken(user),
      });
    } else {
      res.json({
        success: false,
      });
    }
  });
};

const withdrawFunc = async (
  web3Provider: string,
  coin_address: string,
  network: string,
  amount: number,
  withdrawAddr: string
) => {
  const web3 = new Web3(web3Provider);
  const contractAbi: any = contractApi;
  const contractInstance = new web3.eth.Contract(contractAbi, coin_address);
  const gasPrice = await web3.eth.getGasPrice();

  let withdrawAmount = new BigNumber(0);
  await contractInstance.methods.decimals().call((error: any, result: any) => {
    if (!error) {
      console.log(`The ${coin_address} token has ${result} decimal places.`);
      withdrawAmount = amount * Math.pow(10, result);
    } else {
      console.error(error);
    }
  });

  const transferFunc = contractInstance.methods.transfer(
    withdrawAddr,
    withdrawAmount.toString()
  );

  transferFunc
    .estimateGas({
      from:
        network == TRON
          ? (process.env.TRON_ADMIN_WALLET as string)
          : (process.env.ADMIN_WALLET as string),
    })
    .then((gasAmount: number) => {
      web3.eth.getGasPrice().then(async (gasPrice: any) => {
        const senderPrivateKey =
          network == TRON
            ? (process.env.TRON_ADMIN_PRIVATEKEY as string)
            : (process.env.ADMIN_PRIVATEKEY as string);
        const account = web3.eth.accounts.privateKeyToAccount(senderPrivateKey);
        web3.eth.defaultAccount = account.address;
        const txObject = {
          from: web3.eth.defaultAccount,
          to: coin_address,
          gas: gasAmount,
          gasPrice: gasPrice,
          data: contractInstance.methods
            .transfer(withdrawAddr, withdrawAmount.toString())
            .encodeABI(),
        };
        const signedTx = await web3.eth.accounts.signTransaction(
          txObject,
          senderPrivateKey
        );
        const sentTx = await web3.eth.sendSignedTransaction(
          signedTx.rawTransaction ? signedTx.rawTransaction : ""
        );
        console.log(sentTx);
      });
    });
};

const sendTransaction = async (
  web3_prvider: string,
  coin_address: string,
  tokenAmount: number,
  userWallet: string,
  user_privatekey: string,
  network: string
) => {
  const web3 = new Web3(web3_prvider);
  const contractAbi: any = contractApi;
  const contractInstance = new web3.eth.Contract(contractAbi, coin_address);
  const gasPrice = await web3.eth.getGasPrice();

  const transferFunc = contractInstance.methods.transfer(
    network === TRON
      ? (process.env.TRON_COLD_ADMIN_WALLET as string)
      : (process.env.COLD_ADMIN_WALLET as string),
    tokenAmount.toString()
  );

  transferFunc.estimateGas({ from: userWallet }).then((gasAmount: number) => {
    web3.eth.getGasPrice().then(async (gasPrice: any) => {
      const totalGasFee = gasAmount * gasPrice;
      const gasvalue = network === BNBCHAIN ? 21000 : 2000000;
      const SingedTransaction = await web3.eth.accounts.signTransaction(
        {
          to: userWallet,
          value: totalGasFee,
          gas: gasvalue,
        },
        network === TRON
          ? (process.env.TRON_ADMIN_PRIVATEKEY as string)
          : (process.env.ADMIN_PRIVATEKEY as string)
      );
      web3.eth
        .sendSignedTransaction(
          SingedTransaction.rawTransaction
            ? SingedTransaction.rawTransaction
            : ""
        )
        .then(async (receipt) => {
          console.log("gas fee sent:", receipt);
          const userPrivateKey = user_privatekey;
          const account = web3.eth.accounts.privateKeyToAccount(userPrivateKey);
          web3.eth.defaultAccount = account.address;
          const txObject = {
            from: web3.eth.defaultAccount,
            to: coin_address,
            gas: gasAmount,
            gasPrice: gasPrice,
            data: contractInstance.methods
              .transfer(
                network === TRON
                  ? (process.env.TRON_COLD_ADMIN_WALLET as string)
                  : (process.env.COLD_ADMIN_WALLET as string),
                tokenAmount.toString()
              )
              .encodeABI(),
          };
          const signedTx = await web3.eth.accounts.signTransaction(
            txObject,
            userPrivateKey
          );
          const sentTx = await web3.eth.sendSignedTransaction(
            signedTx.rawTransaction ? signedTx.rawTransaction : ""
          );
          console.log(sentTx);
        });
    });
  });
};

export const deposit = async (req: Request, res: Response) => {
  User.findById(req.body.user).then((user: any) => {
    if (user) {
      // ETHEREUM NETWORK
      if (req.body.network === ETHEREUM) {
        const filter_address = user.address.ether.address;
        const private_key = user.address.ether.privateKey;

        const coin_address =
          req.body.coin === "BUSD"
            ? BUSD_TOKEN_ADDRESS_ETH
            : req.body.coin === "USDT"
            ? USDT_TOKEN_ADDRESS_ETH
            : CAKE_TOKEN_ADDRESS_ETH;
        const config_url = `api?module=account&action=tokentx&contractaddress=${coin_address}&address=${filter_address}&page=1&offset=10&startblock=0&endblock=99999999&sort=desc&apikey=ABUVDNYMXVENVGYN3FY4BYFEFHB6Y2P1JK`;
        let tokenAmount: number = 0;
        let flag: number = 0;
        Axios.get(`${ETHEREUM_TRANSACTION}/${config_url}`).then((result) => {
          if (result.data.status === "0") {
            res.json({ success: false, message: result.data.message });
          } else if (result.data.status === "1") {
            const depositCnt = result.data.result.filter(
              (item: any) =>
                item.to.toLowerCase() === filter_address.toLowerCase()
            ).length;
            if (req.body.coin === "BUSD") {
              if (user.txcount.busd < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.busd +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].tokenDecimal);
                user.txcount.busd = depositCnt;
                user.save();
              }
            } else if (req.body.coin === "USDT") {
              if (user.txcount.usdt < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.usdt += result.data.result[0].value;
                user.txcount.usdt = depositCnt;
                user.save();
              }
            } else if (req.body.coin === "CAKE") {
              if (user.txcount.cake < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.cake +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].tokenDecimal);
                user.txcount.cake = depositCnt;
                user.save();
              }
            }
            const temp = result.data.result
              .filter(
                (item: any) =>
                  item.to.toLowerCase() === filter_address.toLowerCase()
              )
              .map((p: any, i: number) => {
                return {
                  _id: i + 1,
                  amount: p.value / Math.pow(10, p.tokenDecimal),
                  address: p.from,
                  date: new Date(p.timeStamp * 1000).toUTCString(),
                  coin: p.tokenSymbol,
                };
              });

            if (flag) {
              sendTransaction(
                ETH_MAINNET_WEB3PROVIDER,
                coin_address,
                tokenAmount,
                filter_address,
                private_key,
                req.body.network
              );
              flag = 0;
            }

            res.json({
              success: true,
              model: temp,
              token: generateToken(user),
            });
          }
        });
      } else if (req.body.network === BNBCHAIN) {
        // ETHEREUM NETWORK
        const filter_address = user.address.bitcoin.address;
        const private_key = user.address.bitcoin.privateKey;

        const coin_address =
          req.body.coin === "BUSD"
            ? BUSD_TOKEN_ADDRESS_BNB
            : req.body.coin === "USDT"
            ? USDT_TOKEN_ADDRESS_BNB
            : CAKE_TOKEN_ADDRESS_BNB;
        const config_url = `api?module=account&action=tokentx&contractaddress=${coin_address}&address=${filter_address}&startblock=0&endblock=999999999&page=1&offset=100&sort=desc&apikey=IHX3A7GFSDN8EFQCK2PA2DAZF8K9BW37M9`;
        let tokenAmount: number = 0;
        let flag: number = 0;
        Axios.get(`${BNBCHAIN_TRANSACTION}/${config_url}`).then((result) => {
          if (result.data.status === "0") {
            res.json({ success: false, message: result.data.message });
          } else if (result.data.status === "1") {
            const depositCnt = result.data.result.filter(
              (item: any) =>
                item.to.toLowerCase() === filter_address.toLowerCase()
            ).length;
            if (req.body.coin === "BUSD") {
              console.log(111, "BUSD deposit on BNB network");

              if (user.txcount.busd < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.busd +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].tokenDecimal);
                user.txcount.busd = depositCnt;
                user.save();
              }
            } else if (req.body.coin === "USDT") {
              if (user.txcount.usdt < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.usdt +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].tokenDecimal);
                user.txcount.usdt = depositCnt;
                user.save();
              }
            } else if (req.body.coin === "CAKE") {
              if (user.txcount.cake < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.cake +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].tokenDecimal);
                user.txcount.cake = depositCnt;
                user.save();
              }
            }
            const temp = result.data.result
              .filter(
                (item: any) =>
                  item.to.toLowerCase() === filter_address.toLowerCase()
              )
              .map((p: any, i: number) => {
                return {
                  _id: i + 1,
                  amount: p.value / Math.pow(10, p.tokenDecimal),
                  address: p.from,
                  date: new Date(p.timeStamp * 1000).toUTCString(),
                  coin: p.tokenSymbol,
                };
              });

            if (flag) {
              sendTransaction(
                BSC_MAINNET_WEB3PROVIDER,
                coin_address,
                tokenAmount,
                filter_address,
                private_key,
                req.body.network
              );
              flag = 0;
            }

            res.json({
              success: true,
              model: temp,
              token: generateToken(user),
            });
          }
        });
      } else if (req.body.network === "TRON") {
        const filter_address = user.address.tron.address;
        const private_key = user.address.tron.privateKey;
        // const filter_address = "TLdZs7erUzBy2eKcdMXqeCKbGXAYF8rz89";
        const coin_address =
          req.body.coin === "BUSD"
            ? BUSD_TOKEN_ADDRESS_TRON
            : req.body.coin === "USDT"
            ? USDT_TOKEN_ADDRESS_TRON
            : CAKE_TOKEN_ADDRESS_TRON;
        const config_url = `v1/accounts/${filter_address}/transactions/trc20?limit=100&contract_address=${coin_address}`;
        let tokenAmount: number = 0;
        let flag: number = 0;
        Axios.get(`${TRON_TRANSACTION}/${config_url}`).then((result) => {
          if (!result.data.success) {
            res.json({ success: false, message: result.data.message });
          } else if (result.data.status) {
            const depositCnt = result.data.result.filter(
              (item: any) =>
                item.to.toLowerCase() === filter_address.toLowerCase()
            ).length;
            if (req.body.coin === "BUSD") {
              if (user.txcount.busd < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.busd +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].token_info.decimals);
                user.txcount.busd = depositCnt;
                user.save();
              }
            } else if (req.body.coin === "USDT") {
              if (user.txcount.usdt < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.usdt +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].token_info.decimals);
                user.txcount.usdt = depositCnt;
                user.save();
              }
            } else if (req.body.coin === "CAKE") {
              if (user.txcount.cake < depositCnt) {
                flag = 1;
                tokenAmount = result.data.result[0].value;
                user.money.cake +=
                  result.data.result[0].value /
                  Math.pow(10, result.data.result[0].token_info.decimals);
                user.txcount.cake = depositCnt;
                user.save();
              }
            }
            const temp = result.data.data
              .filter(
                (item: any) =>
                  item.to.toLowerCase() === filter_address.toLowerCase()
              )
              .map((p: any, i: number) => {
                return {
                  _id: i + 1,
                  amount: p.value / Math.pow(10, p.token_info.decimals),
                  address: p.from,
                  date: new Date(p.timeStamp * 1000).toUTCString(),
                  coin: p.token_info.symbol,
                };
              });

            if (flag) {
              sendTransaction(
                TRON_MAINNET_WEB3PROVIDER,
                coin_address,
                tokenAmount,
                filter_address,
                private_key,
                req.body.network
              );
              flag = 0;
            }
            res.json({
              success: true,
              model: temp,
              user,
              token: generateToken(user),
            });
          }
        });
      }
    }
  });
};

export const withdraw = async (req: Request, res: Response) => {
  User.findById(req.body.user).then((user: any) => {
    if (user) {
      let amount = req.body.amount;
      let withdrawAddr = req.body.address;
      let network = req.body.network;
      let coin = req.body.coin;
      let curAmount =
        coin == "BUSD"
          ? user.money.busd
          : coin == "USDT"
          ? user.money.usdt
          : user.money.cake;
      if (curAmount < amount) {
        res.json({
          success: false,
          message: "You have not enought coin to withdraw",
          token: generateToken(user),
        });
      } else {
        let coin_address = "";
        if (coin == "BUSD") {
          user.money.busd -= amount;
        } else if (coin == "USDT") {
          user.money.usdt -= amount;
        } else if (coin == "CAKE") {
          user.money.cake -= amount;
        }
        user.save();
        if (network == ETHEREUM) {
          coin_address =
            coin === "BUSD"
              ? BUSD_TOKEN_ADDRESS_ETH
              : req.body.coin === "USDT"
              ? USDT_TOKEN_ADDRESS_ETH
              : CAKE_TOKEN_ADDRESS_ETH;
        } else if (network == BNBCHAIN) {
          coin_address =
            coin === "BUSD"
              ? BUSD_TOKEN_ADDRESS_BNB
              : req.body.coin === "USDT"
              ? USDT_TOKEN_ADDRESS_BNB
              : CAKE_TOKEN_ADDRESS_BNB;
        } else if (network == TRON) {
          coin_address =
            coin === "BUSD"
              ? BUSD_TOKEN_ADDRESS_TRON
              : req.body.coin === "USDT"
              ? USDT_TOKEN_ADDRESS_TRON
              : CAKE_TOKEN_ADDRESS_TRON;
        }

        let web3Provider =
          network == ETHEREUM
            ? ETH_MAINNET_WEB3PROVIDER
            : network == BNBCHAIN
            ? BSC_MAINNET_WEB3PROVIDER
            : TRON_MAINNET_WEB3PROVIDER;
        withdrawFunc(web3Provider, coin_address, network, amount, withdrawAddr);

        // Save history when user withdraw the money (params: withdrawAddr, coin, amount, user )
        new History({
          user: req.body.user,
          coin,
          amount,
          address: withdrawAddr,
        })
          .save()
          .then((res) => console.log(res, 9090))
          .catch((err) => console.log(err));

        res.json({
          success: true,
          token: generateToken(user),
        });
      }
    }
  });
};

export const swap = async (req: Request, res: Response) => {
  User.findById(req.body.user).then((user: any) => {
    if (user) {
      let fromAmount = 0;
      let toAmount = 0;
      switch (req.body.coinFrom) {
        case "BUSD":
          fromAmount = user.money.busd;
          break;
        case "USDT":
          fromAmount = user.money.usdt;
          break;
        case "USD":
          fromAmount = user.money.usd;
          break;
        case "BITP":
          fromAmount = user.money.bitp;
          break;
        case "CAKE":
          fromAmount = user.money.cake;
          break;
      }

      switch (req.body.coinTo) {
        case "BUSD":
          toAmount = user.money.busd;
          break;
        case "USDT":
          toAmount = user.money.usdt;
          break;
        case "USD":
          toAmount = user.money.usd;
          break;
        case "BITP":
          toAmount = user.money.bitp;
          break;
        case "CAKE":
          toAmount = user.money.cake;
          break;
        case "Quest Credit":
          toAmount = user.money.quest;
          break;
      }
      if (fromAmount < req.body.fromTokenAmount) {
        res.json({
          success: false,
          message: "You have not enought token amount to swap",
        });
      } else {
        switch (req.body.coinFrom) {
          case "BUSD":
            user.money.busd -= req.body.fromTokenAmount;
            break;
          case "USDT":
            user.money.usdt -= req.body.fromTokenAmount;
            break;
          case "USD":
            user.money.usd -= req.body.fromTokenAmount;
            break;
          case "BITP":
            user.money.bitp -= req.body.fromTokenAmount;
            break;
          case "CAKE":
            user.money.cake -= req.body.fromTokenAmount;
            break;
        }

        switch (req.body.coinTo) {
          case "BUSD":
            user.money.busd += req.body.toTokenAmount;
            break;
          case "USDT":
            user.money.usdt += req.body.toTokenAmount;
            break;
          case "USD":
            user.money.usd += req.body.toTokenAmount;
            break;
          case "BITP":
            user.money.bitp += req.body.toTokenAmount;
            break;
          case "CAKE":
            user.money.cake += req.body.toTokenAmount;
            break;
          case "Quest Credit":
            user.money.quest += req.body.toTokenAmount;
            break;
        }
        user.save();
        res.json({
          success: true,
          message: "swap successfully done",
        });
      }
    } else {
      res.json({
        success: false,
        message: "user session invalid",
      });
    }
  });
};

export const withdrawHistory = async (req: Request, res: Response) => {
  History.find({ user: req.body.user }).then((history: any) => {
    if (history) {
      res.json({
        success: true,
        history,
      });
    } else {
      res.json({
        success: false,
        message: "No history found",
      });
    }
  });
};
