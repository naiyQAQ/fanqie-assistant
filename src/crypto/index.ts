import md5 from "./md5";
import { sm3 } from "./sm3";

export function getCrypto(): Crypto {
    const c = globalThis.crypto ?? (unsafeWindow.crypto as Crypto | undefined);
    if (!c?.subtle) {
        throw new Error("Crypto API不可用，请检查浏览器版本是否支持该API");
    }
    return c;
}

export function getSubtle(): SubtleCrypto {
    return getCrypto().subtle;
}

export function b64decode(b64: string): ArrayBuffer {
    const binaryString = atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export function b64encode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    const chunks: string[] = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
        chunks.push(
            String.fromCharCode(...bytes.subarray(i, i + chunkSize)),
        );
    }
    return btoa(chunks.join(""));
}

export function unhex(hex: string): ArrayBuffer {
    if (hex.length % 2 !== 0) {
        throw new Error("Invalid hex string");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.slice(i, i + 2), 16);
        if (Number.isNaN(byte)) {
            throw new Error("Invalid hex string");
        }
        bytes[i / 2] = byte;
    }
    return bytes.buffer;
}

export function hex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let hexString = "";
    for (let i = 0; i < bytes.length; i++) {
        hexString += bytes[i]!.toString(16).padStart(2, "0");
    }
    return hexString;
}

export function pkcs7Pad(data: Uint8Array, blockSize = 16): Uint8Array<ArrayBuffer> {
    const padLength = blockSize - (data.length % blockSize);
    const padded = new Uint8Array(data.length + padLength);
    padded.set(data);
    padded.fill(padLength, data.length);
    return padded;
}

export function randomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const array = new Uint8Array(length);
    getCrypto().getRandomValues(array);
    for (let i = 0; i < length; i++) {
        result += chars.charAt(array[i]! % chars.length);
    }
    return result;
}

type HashInput = ArrayBuffer | Uint8Array<ArrayBuffer> | string;

function toBytes(input: HashInput): Uint8Array<ArrayBuffer> {
    if (typeof input === "string") {
        return new TextEncoder().encode(input);
    }
    if (input instanceof Uint8Array) {
        return new Uint8Array(input);
    }
    return new Uint8Array(input);
}

export const hash = {
    sha256: async (input: HashInput): Promise<string> => {
        const subtle = getSubtle();
        const digest = await subtle.digest("SHA-256", toBytes(input));
        return hex(digest);
    },
    sha256bytes: async (input: HashInput): Promise<ArrayBuffer> => {
        const subtle = getSubtle();
        return subtle.digest("SHA-256", toBytes(input));
    },
    sha512: async (input: HashInput): Promise<string> => {
        const subtle = getSubtle();
        const digest = await subtle.digest("SHA-512", toBytes(input));
        return hex(digest);
    },
    sha512bytes: async (input: HashInput): Promise<ArrayBuffer> => {
        const subtle = getSubtle();
        return subtle.digest("SHA-512", toBytes(input));
    },
    md5: async (input: HashInput): Promise<string> => md5(
        typeof input === "string" ? input : toBytes(input).buffer,
    ),
    md5bytes: async (input: HashInput): Promise<ArrayBuffer> => unhex(md5(
        typeof input === "string" ? input : toBytes(input).buffer,
    )),
    sm3: async (input: HashInput): Promise<string> => hex(sm3(toBytes(input)).buffer),
    sm3bytes: async (input: HashInput): Promise<ArrayBuffer> => sm3(toBytes(input)).buffer,
};
