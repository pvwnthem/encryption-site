'use client'
import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const DecryptForm = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [inputFile, setInputFile] = useState<string | null>(null);
  const [decryptedText, setDecryptedText] = useState('');

  const handleInputChange = (event: any) => {
    setEncryptedData(event.target.value);
  };
  

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
  
      reader.addEventListener('load', (event) => {
        const fileContents = event.target?.result;
        setInputFile(fileContents instanceof ArrayBuffer ? '' : fileContents);
      });
  
      reader.readAsText(e.target.files[0]);
    }
  }
  
  const handleDecrypt = async () => {
    if (inputFile) {
      const fileData = inputFile.split("|")
      const keyBuffer = TextHelper.convertBase64ToStream(fileData[1]);

      cryptoService.parseKey(keyBuffer).then((key) => {
        const cipherBuffer = TextHelper.convertBase64ToStream(
            fileData[0]
        );

        const ivBuffer = TextHelper.convertBase64ToStream<Uint8Array>(
          fileData[2]
        );

        cryptoService.decrypt(cipherBuffer, key, ivBuffer).then((res) =>
        {
          setDecryptedText(res) 
        }  
        );
      });

    } else {
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
    }
    
  };
  

  return (
    <div className="max-w-md mx-left p-4">
      <textarea
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        placeholder="Enter encrypted JSON data"
        value={encryptedData}
        onChange={handleInputChange}
      />
      <input type="file" onChange={onSelectFile} />
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
