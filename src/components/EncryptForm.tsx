import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const EncryptForm = () => {
  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState<any>(null);
  const [encryptedData, setEncryptedData] = useState<any>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setInputFile(file);
  };

  const handleEncrypt = async () => {
    try {
      let plainData: any = inputText;
      if (inputFile) {
        plainData = inputFile;
      }

      const { cipher, key, iv } = await cryptoService.encrypt(plainData);
      if (inputFile) {
        const encryptedFile = new Blob([TextHelper.convertStreamToBase64(cipher), " ", TextHelper.convertStreamToBase64(key), " ", TextHelper.convertStreamToBase64(iv) ], { type: 'application/octet-stream' });
      const encryptedFileUrl = URL.createObjectURL(encryptedFile);
      setEncryptedData({
        cipher: TextHelper.convertStreamToBase64(cipher),
        key: TextHelper.convertStreamToBase64(key),
        iv: TextHelper.convertStreamToBase64(iv),
        fileUrl: encryptedFileUrl,
      });
      }
       else {
        setEncryptedData({
          cipher: TextHelper.convertStreamToBase64(cipher),
          key: TextHelper.convertStreamToBase64(key),
          iv: TextHelper.convertStreamToBase64(iv),
          
        });
       }

      
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <textarea
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Enter text to encrypt"
        value={inputText}
        onChange={handleInputChange}
      />
      <input type="file" onChange={handleFileChange} />
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleEncrypt}>
        Encrypt
      </button>
      {encryptedData && (
        <div className="mt-4">
          <h3 className="font-semibold">Encrypted Data:</h3>
          <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
          {encryptedData.fileUrl && (
            <a href={encryptedData.fileUrl} download="encrypted_file.bin">
              Download Encrypted File
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default EncryptForm;
