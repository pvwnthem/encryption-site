import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';
import download from 'downloadjs';
import ErrorMessage from './errors/Error';

const DecryptForm = () => {
  // State variables
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [inputFiles, setInputFiles] = useState<any>([]);
  const [decryptedData, setDecryptedData] = useState<any>('');
  const [fileUrls, setFileUrls] = useState<any>([]);
  const [encryptionKey, setEncryptionKey] = useState<any>('');
  const [mode, setMode] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Event handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEncryptedData(event.target.value);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setInputFiles(files);
    }
  };

  const handleDecrypt = async () => {
    if (mode && !encryptionKey) {
      setError('When using secure mode, you must provide an encryption key');
      return;
    }

    if (inputFiles.length > 0 || encryptedData) {
      try {
        const decryptedFiles: any[] = [];

        for (const file of inputFiles) {
          const reader = new FileReader();

          reader.addEventListener('load', async () => {
            const fileContents = reader.result?.toString() || '';

            const decryptedFile = await decryptFile(fileContents);

            decryptedFiles.push({
              fileContents: decryptedFile,
              fileName: file.name,
            });

            if (decryptedFiles.length === inputFiles.length) {
              setDecryptedData(decryptedFiles);
            }
          });

          reader.readAsText(file);
        }

        if (encryptedData) {
          const decryptedFile = await decryptFile(encryptedData);
          decryptedFiles.push({
            fileContents: decryptedFile,
          });

          setDecryptedData(decryptedFiles);
        }

        setError(''); // set a blank error on successful decryption
      } catch (error) {
        setError('Decryption failed: ' + error);
      }
    } else {
      setError('Please make sure all fields are filled in before submitting');
    }
  };

  const decryptFile = async (fileContents: string) => {
    const fileData = fileContents.split('|');
    const keyBuffer = encryptionKey
      ? TextHelper.convertBase64ToStream(encryptionKey)
      : TextHelper.convertBase64ToStream(fileData[1]);

    const key = await cryptoService.parseKey(keyBuffer);
    const cipherBuffer = TextHelper.convertBase64ToStream(fileData[0]);

    const ivBuffer = mode
      ? TextHelper.convertBase64ToStream<Uint8Array>(fileData[1])
      : TextHelper.convertBase64ToStream<Uint8Array>(fileData[2]);

    const decryptedData = await cryptoService.decrypt(cipherBuffer, key, ivBuffer);

    if (mode) {
      const decryptedFile = new Blob([decryptedData], { type: 'application/octet-stream' });
      const decryptedFileUrl = URL.createObjectURL(decryptedFile);
      setFileUrls((prevFileUrls: any) => [...prevFileUrls, decryptedFileUrl]);
    }

    return decryptedData;
  };

  return (
    <div className="max-w-lg  p-12 bg-white rounded-lg shadow shadow-2xl">
      <h1 className="text-2xl py-2 font-bold mb-4">Decrypt Data</h1>
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
        {mode && (
          <>
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
          </>
        )}
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
          multiple
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
      {decryptedData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Decrypted Data:</h3>
          {decryptedData.map((file: any, index: any) => (
            <div key={index}>
              <h4 className="font-medium">{file.fileName}</h4>
              <div className="overflow-x-auto">
                <pre>{file.fileContents.length > 2048 ? 'Sorry, this data is too large to display!' : file.fileContents}</pre>
              </div>
              <img src={file.fileContents} alt="Decrypted Image" />
              {mode && fileUrls[index] && (
                <a
                  onClick={() =>
                    download(
                      file.fileContents,
                      `decrypted${TextHelper.generateFileExtension(
                        TextHelper.extractMimeTypeFromBase64(file.fileContents)
                      )}`,
                      TextHelper.extractMimeTypeFromBase64(file.fileContents)
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
                  navigator.clipboard.writeText(file.fileContents.toString());
                }}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full px-4 py-2 mt-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => {
          window.location.replace(window.location + '/help');
        }}
      >
        Help
      </button>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default DecryptForm;
