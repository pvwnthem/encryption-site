const convertStreamToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
  return window.btoa(
    new Uint8Array(buffer).reduce((a, b) => a + String.fromCharCode(b), "")
  );
};

const convertBase64ToStream = <T extends ArrayBuffer | Uint8Array>(
  base64: string,
  mimeType?: string
): T => {
  let sanitized = base64;

  if (mimeType) sanitized = sanitized.replace(`data:${mimeType};base64,`, "");

  const bin = window.atob(sanitized);
  const buffer = new ArrayBuffer(bin.length);
  const bufferView = new Uint8Array(buffer);

  for (let i = 0; i < bin.length; i++) bufferView[i] = bin.charCodeAt(i);

  return buffer as T;
};

/** Encoding / Decoding */

const encode = (data: string) => new TextEncoder().encode(data);
const decode = (buffer: ArrayBuffer) => new TextDecoder().decode(buffer);

export default {
  convertStreamToBase64,
  convertBase64ToStream,
  encode,
  decode
}