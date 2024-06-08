import axios from "axios";
import CryptoJS from "crypto-js";

export const decryptVault = (encryptedVault: string, vaultKey: string) => {
    // const decryptedData = CryptoJS.AES.decrypt(encryptedVault, vaultKey).toString(
    //     CryptoJS.enc.Utf8
    // );

    return encryptedVault;
};