import React from "react";
import Link from "next/link";

export default function Help() {
  return (
    <div className="bg-white text-black">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-lg mb-8">
          Welcome to our help center. Here you can find answers to frequently asked questions and get support for any issues you may be experiencing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-blue-500 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Encryption</h2>
            <p className="mb-4">
              When using the encryption features, you have a few options. You can either encrypt text or a file with our tool. Some other options for this encryption include setting a custom encryption key and using secure mode.
            </p>
            <p className="mb-4">
              Secure mode is only available for file encryption and ensures that the encrypted files are stored securely. To decrypt a secure file, you will need to provide the key it was encrypted with in the encryption key field.
            </p>
            <p>
              When you encrypt a file, the encrypted data shown will display the key it was encrypted with. If you wish to encrypt more files with the same key, click "Copy Key" and paste the key in the encryption key field.
            </p>
          </div>
          <div className="p-4 bg-blue-500 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">FAQs</h2>
            <ul>
              <li>
                <strong>Can I use anything as a key?</strong> No. Only keys generated by the encryption tool on the site can be used.
              </li>
              <li>
                <strong>How do I decrypt my secure file?</strong> To decrypt a secure file, enter the key it was encrypted with into the decryption key field. Ensure that the secure mode checkbox is clicked, and press "Decrypt".
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
