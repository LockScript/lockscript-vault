import axios from "axios";
import CryptoJS from "crypto-js";

export const updateVault = async (vault: VaultItem[]) => {
    const response = await axios.post("/api/vault/update", { vault });
    if (response.status !== 200) {
        throw new Error("Failed to update vault");
    }
    return response.data;
};

export const decryptVault = (encryptedVault: string, vaultKey: string) => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedVault, vaultKey).toString(
        CryptoJS.enc.Utf8
    );

    return decryptedData;
};