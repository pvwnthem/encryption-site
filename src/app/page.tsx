'use client'
import React from "react"
import encryptionService from "@/services/encryption.service"
import TextHelper from '@/util/base64';


export default function Home() {
  const [encryption, setEncryption] = React.useState<any>(null);
  const [text, setText] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (text) {
      try {
        encryptionService.encrypt(text).then(({ cipher, key, iv }) => {
          setEncryption({
            cipher: TextHelper.convertStreamToBase64(cipher),
            key: TextHelper.convertStreamToBase64(key),
            iv: TextHelper.convertStreamToBase64(iv),
          });
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [text]);
  
  return (
    <>
    {JSON.stringify(encryption)}
    </>
  )
}
