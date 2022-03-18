import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secretKey =
  process.env.IMAGES_SECRET_KEY || 'qwertyuiopasdfghjklzxcvbnmqwerty';
const iv = crypto.randomBytes(16);

export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

export const decrypt = (text: string, iv2: string) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv2, 'hex'),
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(text, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};
