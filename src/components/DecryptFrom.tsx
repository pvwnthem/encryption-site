'use client'
import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const DecryptForm = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [decryptedText, setDecryptedText] = useState('');

  const handleInputChange = (event: any) => {
    setEncryptedData(event.target.value);
  };

  const handleDecrypt = async () => {
    const keyBuffer = TextHelper.convertBase64ToStream(JSON.parse(encryptedData).key);

      cryptoService.parseKey(keyBuffer).then((key) => {
        const cipherBuffer = TextHelper.convertBase64ToStream(
            JSON.parse(encryptedData).cipher
        );

        const ivBuffer = TextHelper.convertBase64ToStream<Uint8Array>(
            JSON.parse(encryptedData).iv
        );

        cryptoService.decrypt(cipherBuffer, key, ivBuffer).then((res) =>
        {
          setDecryptedText(res) 
        }  
        );
      });
  };
  

  return (
    <div className="max-w-md mx-auto p-4">
      <textarea
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Enter encrypted JSON data"
        value={encryptedData}
        onChange={handleInputChange}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={handleDecrypt}
      >
        Decrypt
      </button>
      {decryptedText && (
        <div className="mt-4">
          <h3 className="font-semibold">Decrypted Text:</h3>
          <pre>{decryptedText}</pre>
          <img src={decryptedText}></img>
        </div>
      )}
    </div>
  );
};

export default DecryptForm;
