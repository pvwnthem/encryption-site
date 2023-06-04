import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const EncryptForm = () => {
  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState<any>(null);
  const [encryptedData, setEncryptedData] = useState<any>(null);



  
  const handleInputChange = (event: any) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setInputFile(file);
  };

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      
      reader.addEventListener('load', () =>
      {
         console.log(reader.result?.toString())
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
      console.log(plainData.length)
      const { cipher, key, iv } = await cryptoService.encrypt(plainData);
      setEncryptedData({
        cipher: TextHelper.convertStreamToBase64(cipher),
        key: TextHelper.convertStreamToBase64(key),
        iv: TextHelper.convertStreamToBase64(iv),
      });
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
      <input
        type="file"
        onChange={onSelectFile}
        
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
