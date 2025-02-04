import CryptoJS from "crypto-js";

const generateEncryptionPassword = (clerkUser: any) => {
  if (!clerkUser) return "";

  return `${clerkUser.id}-${clerkUser.createdAt}-${clerkUser.createdAt?.getTime()}-${clerkUser.id.charCodeAt(clerkUser.id.length - 1)}-${clerkUser.createdAt?.getDate()}-${clerkUser.id.charCodeAt(0)}-${clerkUser.createdAt?.getUTCFullYear()}-${clerkUser.id.charCodeAt(1)}-${clerkUser.createdAt?.getUTCHours()}-${clerkUser.id.length}-${clerkUser.createdAt?.getUTCMinutes()}`;
};

export const encrypt = (data: string, clerkUser: any) => {
  const encryptionPassword = generateEncryptionPassword(clerkUser);
  return CryptoJS.AES.encrypt(data, encryptionPassword).toString();
};

export const decrypt = (encryptedData: string, clerkUser: any) => {
  const encryptionPassword = generateEncryptionPassword(clerkUser);
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionPassword);
  return bytes.toString(CryptoJS.enc.Utf8);
};
