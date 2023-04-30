import { ethers } from 'ethers';

import { walletResponse } from '../interfaces';
import { ETHEREUM_DEFAULT } from '../../config';

const generateEtherPrivateKey = (derivationPath?: string, nonce?: number) =>  {
    const path = derivationPath || ETHEREUM_DEFAULT;
    const index = nonce || Math.floor(Math.random() * 10);
    const wallet = ethers.Wallet.createRandom({ path: path + index });

    return walletResponse({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase,
        nonce: index
    })
};

const importWalletFromEtherPrivateKey = (mnemonic: string, nonce?: number, derivationPath?: string) => {
    const path = derivationPath || ETHEREUM_DEFAULT;

    const index = nonce || 0;

    const wallet = ethers.Wallet.fromMnemonic(mnemonic, path + index);

    return walletResponse({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic.phrase,
        nonce: index
    })
};

export const getEtherPrivateKeyAndWalletAddress = () => {
    const wallet_info = generateEtherPrivateKey();
    const mnemonic = wallet_info.mnemonic ?? '';

    return importWalletFromEtherPrivateKey(mnemonic, wallet_info.nonce);
}