export const generateAndStoreKey = async (userId: string) => {
  try {
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
  } catch (error) {
    console.error('Key generation failed:', error);
    throw new Error('Failed to generate encryption key');
  }
};

export const setEncryptionKey = async (keyString: string, userId: string) => {
  try {
    if (!keyString || !userId) {
      throw new Error('Key and userId are required.');
    }

    const binaryKey = Uint8Array.from(atob(keyString), (char) => char.charCodeAt(0));

    const key = await crypto.subtle.importKey(
      "raw",
      binaryKey,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );

    localStorage.setItem(`encryptionKey-${userId}`, keyString);

    return key;
  } catch (error) {
    console.error('Setting encryption key failed:', error);
    throw new Error('Failed to set encryption key.');
  }
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
  if (!data || !userId) {
    throw new Error('Data and userId are required');
  }

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
  try {
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
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};