'use client'
import React, { useState } from 'react';
import DecryptForm from '@/components/DecryptFrom';
import EncryptForm from '@/components/EncryptForm';



const Page = () => {
 return (
  <>
      <EncryptForm />
      <DecryptForm />
  </>
 )
};

export default Page;
