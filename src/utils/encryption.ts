import CryptoJS from "crypto-js";


export const generateAndStoreKey = async (userId: string) => {
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedKey = await crypto.subtle.exportKey("raw", key);
  const keyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));

  localStorage.setItem(`encryptionKey-${userId}`, keyString);

  return key;
};

export const retrieveKey = async (userId: string) => {
  const keyString = localStorage.getItem(`encryptionKey-${userId}`);
  if (!keyString) throw new Error("Encryption key not found.");

  const binaryKey = Uint8Array.from(atob(keyString), (char) => char.charCodeAt(0));
  return await crypto.subtle.importKey(
    "raw",
    binaryKey,
    { name: "AES-GCM" },
    true,
    ["encrypt", "decrypt"]
  );
};


export const encrypt = async (data: string, userId: string) => {
  const key = await retrieveKey(userId);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(data);

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    encodedData
  );

  return {
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
    iv: btoa(String.fromCharCode(...iv)),
  };
};

export const decrypt = async (
  encryptedData: string,
  iv: string,
  userId: string
): Promise<string> => {
  const key = await retrieveKey(userId);
  const decoder = new TextDecoder();

  const encryptedBuffer = Uint8Array.from(atob(encryptedData), (char) => char.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), (char) => char.charCodeAt(0));

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    encryptedBuffer
  );

  return decoder.decode(decryptedBuffer);
};
