import React, { useState } from 'react';
import cryptoService from '@/services/encryption.service';
import TextHelper from '@/util/base64';

const EncryptForm = () => {
  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState<any>(null);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [eventFile, setEventFile] = useState<File>()



  
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

      const { cipher, key, iv } = await cryptoService.encrypt(plainData);
      if (inputFile) {
        const encryptedFile = new Blob([TextHelper.convertStreamToBase64(cipher), "|", TextHelper.convertStreamToBase64(key), "|", TextHelper.convertStreamToBase64(iv) ], { type: 'application/octet-stream' });
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
    <div className="max-w-md mx-left p-4">
      <h1>This is not secure, please dont use this to actually encrypt and store your files, it stores the encryption key in the file along with the data</h1>
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
          {encryptedData.fileUrl && (
            <a href={encryptedData.fileUrl} download={eventFile?.name + ".bin"}>
              Download Encrypted File
            </a>
          )}
          <button className='p-2 bg-blue-500 text-white rounded-md' onClick={() => {navigator.clipboard.writeText(JSON.stringify(encryptedData))}} >Copy</button>
        </div>
      )}
    </div>
  );
};

export default EncryptForm;
