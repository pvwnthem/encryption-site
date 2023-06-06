'use client'

import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import DecryptForm from '@/components/DecryptForm';
import EncryptForm from '@/components/EncryptForm';



const Page = () => {
 return (
  <>
  <BrowserRouter>
  <div className='md:flex items-center space-x-12 h-screen justify-center'>
    <EncryptForm />
      <DecryptForm />
  </div>
     </BrowserRouter> 
  </>
  
 )
};

export default Page;
