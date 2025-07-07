import { EncryptStorageOptions } from './types';
export declare class AsyncEncryptStorage {
    #private;
    storage: Storage | null;
    constructor(secretKey: string, options?: EncryptStorageOptions);
    get length(): Promise<number>;
    setItem(key: string, value: any, dotNotEncrypt?: boolean): Promise<void>;
    getItem<T = any>(key: string, doNotDecrypt?: boolean): Promise<T | undefined>;
    removeItem(key: string): Promise<void>;
    getItemFromPattern(pattern: string): Promise<Record<string, any> | undefined>;
    removeItemFromPattern(pattern: string): Promise<void>;
    clear(): Promise<void>;
    key(index: number): Promise<string | null>;
    encryptString(str: string): Promise<string>;
    decryptString(str: string): Promise<string>;
}
