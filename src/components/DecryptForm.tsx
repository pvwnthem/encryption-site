'use client'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';
import download from 'downloadjs';

const DecryptForm = () => {
  const history = useNavigate();
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [inputFile, setInputFile] = useState<string | null>(null);
  const [decryptedData, setDecryptedData] = useState('');
  const [fileUrl, setFileUrl] = useState('')
  const [encryptionKey, setEncryptionKey] = useState('')
  const [mode, setMode] = useState(true)

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
      const fileData = inputFile.split('|');
      const keyBuffer = encryptionKey
        ? TextHelper.convertBase64ToStream(encryptionKey)
        : TextHelper.convertBase64ToStream(fileData[1]);

      cryptoService.parseKey(keyBuffer).then((key) => {
        const cipherBuffer = TextHelper.convertBase64ToStream(fileData[0]);

        const ivBuffer = mode
          ? TextHelper.convertBase64ToStream<Uint8Array>(fileData[1])
          : TextHelper.convertBase64ToStream<Uint8Array>(fileData[2]);

        cryptoService.decrypt(cipherBuffer, key, ivBuffer).then((res) => {
          setDecryptedData(res);
          const encryptedFile = new Blob([res], { type: 'application/octet-stream' });
          const encryptedFileUrl = URL.createObjectURL(encryptedFile);
          setFileUrl(encryptedFileUrl);
        });
      });
    } else {
      const keyBuffer = encryptionKey
        ? TextHelper.convertBase64ToStream(encryptionKey)
        : TextHelper.convertBase64ToStream(JSON.parse(encryptedData).key);

      cryptoService.parseKey(keyBuffer).then((key) => {
        const cipherBuffer = TextHelper.convertBase64ToStream(JSON.parse(encryptedData).cipher);

        const ivBuffer = TextHelper.convertBase64ToStream<Uint8Array>(JSON.parse(encryptedData).iv);

        cryptoService.decrypt(cipherBuffer, key, ivBuffer).then((res) => {
          setDecryptedData(res);
        });
      });
    }
  };
  

  return (
    <div className="max-w-lg  p-12 bg-white rounded-lg shadow shadow-2xl">
  <h1 className="text-2xl py-2 font-bold mb-4">
    Decrypt Data
  </h1>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="encryptedData">
        Encrypted JSON Data
      </label>
      <textarea
        id="encryptedData"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter encrypted JSON data"
        value={encryptedData}
        onChange={handleInputChange}
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="encryptionKey">
        Encryption Key
      </label>
      <input
        id="encryptionKey"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter encryption key"
        value={encryptionKey}
        onChange={(e) => setEncryptionKey(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fileInput">
        Select File
      </label>
      <input
        id="fileInput"
        type="file"
        onChange={onSelectFile}
        className="w-full p-2 border border-gray-300 rounded"
      />
    </div>
    <div className="flex items-center mb-4">
      <input
        id="secureModeCheckbox"
        type="checkbox"
        checked={mode}
        onChange={() => setMode(!mode)}
        className="mr-2"
      />
      <label className="text-gray-700" htmlFor="secureModeCheckbox">
        Secure Mode
      </label>
    </div>
    <button
      className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={handleDecrypt}
    >
      Decrypt
    </button>
    {decryptedData && (
      <div className="mt-4">
        <h3 className="font-semibold">Decrypted Data:</h3>
        <div className="overflow-x-auto">
          <pre>{decryptedData}</pre>
        </div>
        <img src={decryptedData} alt="Decrypted Image" />
        {fileUrl && (
          <a
            href={fileUrl}
            onClick={() =>
              download(
                decryptedData,
                `decrypted${TextHelper.generateFileExtension(
                  TextHelper.extractMimeTypeFromBase64(decryptedData)
                )}`,
                TextHelper.extractMimeTypeFromBase64(decryptedData)
              )
            }
            className="text-blue-500 underline"
          >
            Download Decrypted File
          </a>
        )}
        <button
          className="p-2 bg-blue-500 text-white rounded-md ml-2"
          onClick={() => {
            navigator.clipboard.writeText(decryptedData.toString());
          }}
        >
          Copy
        </button>
      </div>
    )}
    <button
        className="w-full px-4 py-2 mt-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => {history("/help"); window.location.reload();}}
      >
        Help
      </button>
  </div>

  );
};

export default DecryptForm;
