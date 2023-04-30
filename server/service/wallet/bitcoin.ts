import * as bip32 from 'bip32'
import * as bip39 from 'bip39'
import * as bitcoin from 'bitcoinjs-lib';

import { walletResponse } from '../interfaces';
import { BITCOIN_DEFAULT,
    BTC_MAINNET,
    BTC_REGTEST,
    BTC_TESTNET, } from '../../config';

const generateBTCPrivateKey = (_network: string, derivedPath?: string) =>  {
    let network;

    switch(_network) {
        case BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }

    const path = derivedPath || BITCOIN_DEFAULT;

    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const root = bip32.fromSeed(seed, network);

    const account = root.derivePath(path);
    const node = account.derive(0);

    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network
    }).address;

    return walletResponse({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic
    })
};

const importWalletFromBTCPrivateKey = (_network: string, mnemonic: string, derivedPath?: string) => {
    let network;

    switch(_network) {
        case BTC_MAINNET:
            network = bitcoin.networks.bitcoin;
            break;
        case BTC_REGTEST:
            network = bitcoin.networks.regtest;
            break;
        case BTC_TESTNET:
            network = bitcoin.networks.testnet;
            break;
        default:
            network = bitcoin.networks.bitcoin;
            break;
    }

    const path = derivedPath || BITCOIN_DEFAULT;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, network);

    const account = root.derivePath(path);
    const node = account.derive(0);

    const address = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network
    }).address;

    return walletResponse({
        address: address,
        privateKey: node.toWIF(),
        mnemonic: mnemonic
    })
};

export const getBTCPrivateKeyAndWalletAddress = () => {
    const wallet_info = generateBTCPrivateKey('');
    const mnemonic = wallet_info.mnemonic ?? '';

    return importWalletFromBTCPrivateKey('', mnemonic);
}