import { b64decode } from '.'

function decodeBase36(c: number): number {
    if (c >= 48 && c <= 57) return c - 48; // '0'-'9'
    if (c >= 97 && c <= 122) return c - 97 + 10; // 'a'-'z'
    return 0xFF;
}

function bitCount(n: number): number {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

function decryptSpadeInner(spadeKey: Uint8Array): Uint8Array {
    const result = new Uint8Array(spadeKey);
    const buff = new Uint8Array(2 + spadeKey.length);
    buff.set([0xFA, 0x55], 0);
    buff.set(spadeKey, 2);

    for (let i = 0; i < result.length; i++) {
        let v = (spadeKey[i]! ^ buff[i]!) - bitCount(i) - 21;
        while (v < 0) { v += 0xFF; }
        result[i] = v;
    }
    return result;
}

function decryptSpade(spadeKeyBytes: Uint8Array): string {
    const spadeKeyLen = spadeKeyBytes.length;
    if (spadeKeyLen < 3) return "";
    const paddingLen = (spadeKeyBytes[0]! ^ spadeKeyBytes[1]! ^ spadeKeyBytes[2]!) - 48;
    if (spadeKeyLen < paddingLen + 2) return "";
    const innerInput = spadeKeyBytes.slice(1, spadeKeyLen - paddingLen);
    const tmpBuff = decryptSpadeInner(innerInput);
    if (tmpBuff.length === 0) return "";
    const skipBytes = decodeBase36(tmpBuff[0]!);
    const decodedMessageLen = spadeKeyLen - paddingLen - 2;
    const endIndex = 1 + decodedMessageLen - skipBytes;
    if (endIndex > tmpBuff.length) return "";
    const finalBytes = tmpBuff.slice(1, endIndex);
    return new TextDecoder("utf-8").decode(finalBytes);
}

export function decryptSpadeA(spadeAStr: string): string {
    try {
        const bytes = new Uint8Array(b64decode(spadeAStr));
        return decryptSpade(bytes);
    } catch (e) {
        console.error("Spade parsing error", e);
        return "";
    }
}