'use client'

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
              When using the ecnryption features you have a few options. You can either encrypt text or a file with our tool. Some other options for this encryption include setting a custom encryption key and using secure mode.
              Secure mode is only avalible for file encryption and makes it to where the encrypted files are actually secure enough to store. To decrypt a secure file you will have to provide the key it was encrypted with in the encryption key field.
              When you encrypt the file, the encrypted data shown will show you the key it was encrypted with, if you wish to encrypt more files with that same key, click copy key and put that key in the encryption key field.

            </p>
            
            
          </div>
          <div className="p-4 bg-blue-500 text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">FAQs</h2>
            <p className="mb-4">
             <p>- Can i use anyting as a key? No. Only keys generated by the encryption on the site can be used </p>
             <p>- How do i decrypt my secure file? You put the key it was encrypted with into the decryption key field, ensure that the secure mode checkbox is clicked, and press decrypt.</p>
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
