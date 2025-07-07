import { EncAlgorithm, Encryptation } from './types';
export declare function getEncryptation(encAlgorithm: EncAlgorithm, secretKey: string): Encryptation;
export declare function hashSHA256(value: string, secret: string): string;
export declare function hashMD5(value: string, secret: string): string;
