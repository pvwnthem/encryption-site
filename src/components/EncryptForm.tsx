'use client'
import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const EncryptForm = () => {
  const [inputText, setInputText] = useState('');
  const [encryptedData, setEncryptedData] = useState<any>(null);

  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleEncrypt = async () => {
    try {
      const { cipher, key, iv } = await cryptoService.encrypt(inputText);
      setEncryptedData({ cipher, key, iv });
    } catch (error) {
      console.error('Encryption failed:', error);
    }
    try {
      cryptoService.encrypt(inputText).then(({ cipher, key, iv }) => {
        setEncryptedData({
          cipher: TextHelper.convertStreamToBase64(cipher),
          key: TextHelper.convertStreamToBase64(key),
          iv: TextHelper.convertStreamToBase64(iv),
        });
      });
    } catch (e) {
      console.error(e);
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
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleEncrypt}
      >
        Encrypt
      </button>
      {encryptedData && (
        <div className="mt-4">
          <h3 className="font-semibold">Encrypted Data:</h3>
          <pre>{JSON.stringify(encryptedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default EncryptForm;
