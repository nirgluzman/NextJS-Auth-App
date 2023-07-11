'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Client Component hook to read the current URL's query string

  const [token, setToken] = useState('');

  const verifyUserEmail = async () => {
    const toastId = toast.loading('Please wait...');
    try {
      const response = await axios.post('/api/users/verifyEmail', null, { params: { token } });
      console.log('Email verification successful', response);
      toast.update(toastId, {
        render: response.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        onClose: () => {
          router.push('/login');
        },
      });
    } catch (error: any) {
      console.error('Email verification failed', error.response);
      toast.update(toastId, {
        render: error.response.data.error,
        type: 'error',
        isLoading: false,
        autoClose: 2000,
        onClose: () => {
          router.push('/login');
        },
      });
    }
  };

  useEffect(() => {
    const urlToken = searchParams.get('token') as string;
    setToken(urlToken);
    console.log('Token from URL', urlToken);
  }, []);

  useEffect(() => {
    if (token?.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <ToastContainer
        position='top-center'
        hideProgressBar={true}
        newestOnTop={true}
        limit={3}
        theme='light'
      />
      <h1 className='text-4xl font-bold'>Verifying Email...</h1>
    </div>
  );
}
