'use client'

import React, { useState } from 'react';

import DecryptForm from '@/components/DecryptForm';
import EncryptForm from '@/components/EncryptForm';



const Page = () => {
 return (
  <>
  <div className='md:flex items-center space-x-12 h-screen justify-center'>
    <EncryptForm />
      <DecryptForm />
  </div>
  </>
  
 )
};

export default Page;
