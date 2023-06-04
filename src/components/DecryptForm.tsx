'use client'
import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';
import download from 'downloadjs';

const DecryptForm = () => {
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [inputFile, setInputFile] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState('');
  const [fileUrl, setFileUrl] = useState('')

  const handleInputChange = (event: any) => {
    setEncryptedData(event.target.value);
  };
  
  function extractMimeTypeFromBase64(base64Data: string | null): string {
    const regex = /^data:(.+);base64,/; // Regular expression to match the MIME type
    const matches = base64Data?.match(regex);
    if (matches && matches.length > 1) {
      return matches[1]; // Extract the MIME type from the matched groups
    } else {
      return ''; // MIME type not found
    }
  }

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
          setDecryptedData(res) 
          const encryptedFile = new Blob([res], { type: 'application/octet-stream' });
          const encryptedFileUrl = URL.createObjectURL(encryptedFile);
          setFileUrl(encryptedFileUrl)
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
          setDecryptedData(res) 
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
      {decryptedData && (
        <div className="mt-4">
          <h3 className="font-semibold">Decrypted Data:</h3>
          <pre>{decryptedData}</pre>
          <img src={decryptedData}></img>
          {fileUrl && (
            
            <a onClick={() => download(decryptedData, "decrypted" + generateFileExtension(extractMimeTypeFromBase64(decryptedData)), extractMimeTypeFromBase64(decryptedData))}>
              Download Decrypted File
            </a>
          )}
         <button className='p-2 bg-blue-500 text-white rounded-md' onClick={() => {navigator.clipboard.writeText(decryptedData.toString())}} >Copy</button>

        </div>
      )}
    </div>
  );
};

export default DecryptForm;
