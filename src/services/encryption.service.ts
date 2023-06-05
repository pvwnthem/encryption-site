import crypto, {subtle} from 'crypto';
import TextManipulationHelper from '@/util/base64'

class CryptoService<T extends AesKeyGenParams | HmacKeyGenParams | Pbkdf2Params = AesKeyGenParams> {
  private algorithm: T;
  private key: Array<KeyUsage>;

  constructor(algo: T, usages: Array<KeyUsage> = ["encrypt", "decrypt"]) {
        this.algorithm = algo;
        this.key = usages;
      
      
      
    
  }

  public generateIv = (): Uint8Array => window.crypto.getRandomValues(new Uint8Array(12));

  public parseKey = async (key: ArrayBuffer) => window.crypto.subtle.importKey("raw", key, this.algorithm, true, this.key);

  public readKey = async (key: CryptoKey): Promise<ArrayBuffer> => window.crypto.subtle.exportKey("raw", key);

  private generateKey = async (): Promise<CryptoKey> => window.crypto.subtle.generateKey(this.algorithm, true, this.key);

  public async encrypt(data: string, encryptionKey? : string): Promise<any> {
    const iv = this.generateIv();
    const algo = { ...this.algorithm, iv };
    const cryptoKey = await this.generateKey();    
    const encoded = TextManipulationHelper.encode(data);
    
    const cipher = encryptionKey ? await window.crypto.subtle.encrypt(algo, await window.crypto.subtle.importKey( "raw", TextManipulationHelper.convertBase64ToStream(encryptionKey), { name: "AES-GCM", length: 256 }, true, ['encrypt', 'decrypt']), encoded)  : await window.crypto.subtle.encrypt(algo, cryptoKey, encoded);
    const key = encryptionKey ? await this.readKey(await window.crypto.subtle.importKey( "raw", TextManipulationHelper.convertBase64ToStream(encryptionKey), { name: "AES-GCM", length: 256 }, true, ['encrypt', 'decrypt'])) : await this.readKey(cryptoKey);

    return { key, cipher, iv };
  }

  public decrypt = async (cipher: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> => {
    const algo = { ...this.algorithm, iv };
    const encoded: ArrayBuffer = await window.crypto.subtle.decrypt(algo, key, cipher);

    return TextManipulationHelper.decode(encoded);
  }
}


const AES_CGM_ALGORITHM = { name: "AES-GCM", length: 256 };
export default new CryptoService(AES_CGM_ALGORITHM);