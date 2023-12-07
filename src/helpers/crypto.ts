import * as crypto from 'crypto-js';

const key = process.env.ENCRYPT_KEY || 'default';

export const encrypt = (text: string) => {
    return crypto.AES.encrypt(text, key).toString();
};

export const decrypt = (text: string) => {
    const bytes = crypto.AES.decrypt(text, key);
    return bytes.toString(crypto.enc.Utf8);
};
