const convertStreamToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
  return window.btoa(
    new Uint8Array(buffer).reduce((a, b) => a + String.fromCharCode(b), "")
  );
};

function generateFileExtension(mimeType: string) {
  const mimeToExtMap: any = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    // Add more MIME types and their corresponding file extensions as needed
  };

  if (mimeType in mimeToExtMap) {
    return mimeToExtMap[mimeType];
  } else {
    return null; // File extension not found
  }
}

function extractMimeTypeFromBase64(base64Data: string | null): string {
  const regex = /^data:(.+);base64,/; // Regular expression to match the MIME type
  const matches = base64Data?.match(regex);
  if (matches && matches.length > 1) {
    return matches[1]; // Extract the MIME type from the matched groups
  } else {
    return ''; // MIME type not found
  }
}

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
  decode,
  extractMimeTypeFromBase64,
  generateFileExtension
}