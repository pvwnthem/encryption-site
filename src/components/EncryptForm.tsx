import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from './errors/Error';

const EncryptForm = () => {
  // State variables
  const [inputText, setInputText] = useState('');
  const [inputFiles, setInputFiles] = useState<any[]>([]);
  const [encryptedData, setEncryptedData] = useState<any[]>([]);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [mode, setMode] = useState(true);
  const [error, setError] = useState('');

  const history = useNavigate();

  // Event handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const handleGenerateKey = async () => {
    const key: CryptoKey = await cryptoService.generateKey();
    setEncryptionKey(TextHelper.convertStreamToBase64(await cryptoService.readKey(key)));
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setInputFiles(files);
    }
  };

  const handleEncrypt = async () => {
    if (mode && !encryptionKey) {
      setError('When using secure mode, you must provide an encryption key');
      return;
    }

    if (inputText || inputFiles.length > 0) {
      try {
        const encryptedFiles: any[] = [];

        for (const file of inputFiles) {
          const reader = new FileReader();

          reader.addEventListener('load', async () => {
            const plainData = reader.result?.toString() || '';

            const { cipher, key, iv } = encryptionKey
              ? await cryptoService.encrypt(plainData, encryptionKey)
              : await cryptoService.encrypt(plainData);

            const encryptedFile = mode
              ? new Blob([TextHelper.convertStreamToBase64(cipher), '|', TextHelper.convertStreamToBase64(iv)], {
                  type: 'application/octet-stream',
                })
              : new Blob(
                  [
                    TextHelper.convertStreamToBase64(cipher),
                    '|',
                    TextHelper.convertStreamToBase64(key),
                    '|',
                    TextHelper.convertStreamToBase64(iv),
                  ],
                  { type: 'application/octet-stream' }
                );

            const encryptedFileUrl = URL.createObjectURL(encryptedFile);

            encryptedFiles.push({
              cipher: TextHelper.convertStreamToBase64(cipher),
              key: mode ? 'Secure mode has hidden this key' : TextHelper.convertStreamToBase64(key),
              iv: TextHelper.convertStreamToBase64(iv),
              fileUrl: encryptedFileUrl,
              fileName: file.name,
            });

            if (encryptedFiles.length === inputFiles.length) {
              setEncryptedData(encryptedFiles);
            }
          });

          reader.readAsDataURL(file);
        }

        setError(''); // set a blank error on successful encryption
      } catch (error) {
        setError('Encryption failed: ' + error);
      }
    } else {
      setError('Please make sure all fields are filled in before submitting');
    }
  };

  return (
    <div className="max-w-lg  p-12 bg-white rounded-lg shadow shadow-2xl">
      <h1 className="text-2xl py-2 font-bold mb-4">Encrypt Data</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="inputText">
          Text to Encrypt
        </label>
        <textarea
          id="inputText"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter text to encrypt"
          value={inputText}
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
            <button
              className="bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 w-full px-4 py-2"
              onClick={handleGenerateKey}
            >
              Generate Key
            </button>
          </>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="fileInput">
          Select File(s)
        </label>
        <input
          id="fileInput"
          type="file"
          multiple
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
        onClick={handleEncrypt}
      >
        Encrypt
      </button>
      {encryptedData.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Encrypted Data:</h3>
          {encryptedData.map((encryptedFile, index) => (
            <>
            <div key={index} className="overflow-x-auto mt-2">
              <pre>
                {JSON.stringify(encryptedFile).length > 2048
                  ? 'Sorry, this data is too large to display!'
                  : JSON.stringify(encryptedFile, null, 4)}
              </pre>
              
              
              
            </div>
            {encryptedFile.fileUrl && (
                <a
                  href={encryptedFile.fileUrl}
                  download={encryptedFile.fileName + '.bin'}
                  className="text-blue-500 underline"
                >
                  Download Encrypted File ({encryptedFile.fileName})
                </a>
              )}
            <div className='space-x-2 mt-2'>
              <button
            className="p-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(encryptedData));
            }}
          >
            Copy
          </button>
          {mode && (
            <button
              className="p-2 bg-blue-500 text-white rounded-md"
              onClick={() => {
                mode ? navigator.clipboard.writeText(encryptionKey) : navigator.clipboard.writeText(JSON.parse(JSON.stringify(encryptedData)).key);
              }}
            >
            Copy Key
          </button>
          )}
          
          
              </div>
            </>
          ))}
          {mode && (
            <p className="text-sm text-gray-700 mt-2">
              You will need the key to decrypt your file if you are using secure mode, so make sure to save it.
            </p>
          )}
        </div>
      )}
      <button
        className="w-full px-4 py-2 mt-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => {
          history('/help');
          window.location.reload();
        }}
      >
        Help
      </button>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default EncryptForm;
