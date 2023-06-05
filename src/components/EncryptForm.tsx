import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const EncryptForm = () => {
  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState<any>(null);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [eventFile, setEventFile] = useState<File>()
  const [encryptionKey, setEncryptionKey] = useState('')
  const [mode, setMode] = useState(true)


  
  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };


  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setEventFile(e.target.files[0])
      const reader = new FileReader();
      
      reader.addEventListener('load', () =>
      {
        setInputFile(reader.result?.toString() || '')
      }
     
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  const handleEncrypt = async () => {
    try {
      let plainData: any = inputText;
      if (inputFile) {
        plainData = inputFile;
      }

      const { cipher, key, iv } = encryptionKey ? await cryptoService.encrypt(plainData, encryptionKey) : await cryptoService.encrypt(plainData);
      if (inputFile) {
        const encryptedFile = mode ? new Blob([TextHelper.convertStreamToBase64(cipher), "|", TextHelper.convertStreamToBase64(iv) ], { type: 'application/octet-stream' }) : new Blob([TextHelper.convertStreamToBase64(cipher), "|", TextHelper.convertStreamToBase64(key), "|", TextHelper.convertStreamToBase64(iv) ], { type: 'application/octet-stream' });
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
    <div className="max-w-lg  p-12 bg-white rounded-lg shadow shadow-2xl">
  <h1 className="text-2xl py-2 font-bold mb-4">
    Encrypt Data
  </h1>
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
    onClick={handleEncrypt}
  >
    Encrypt
  </button>
  {encryptedData && (
    <div className="mt-4">
      <h3 className="font-semibold">Encrypted Data:</h3>
      <div className="overflow-x-auto">
        <pre>{JSON.stringify(encryptedData, null, 4)}</pre>
      </div>
      {encryptedData.fileUrl && (
        <a
          href={encryptedData.fileUrl}
          download={eventFile?.name + ".bin"}
          className="text-blue-500 underline"
        >
          Download Encrypted File
        </a>
      )}
      <button
        className="p-2 bg-blue-500 text-white rounded-md ml-2"
        onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(encryptedData));
        }}
      >
        Copy
      </button>
      <button
        className="p-2 bg-blue-500 text-white rounded-md ml-2"
        onClick={() => {
          navigator.clipboard.writeText(JSON.parse(JSON.stringify(encryptedData)).key);
        }}
      >
        Copy Key
      </button>
      <p className="text-sm text-gray-700 mt-2">
        You will need the key to decrypt your file if you are using secure mode, so make sure to save it.
      </p>
    </div>
  )}
</div>


  );
};

export default EncryptForm;
