'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePage() {
  const router = useRouter();

  const [data, setData] = useState<any>(null);

  const onLogout = async () => {
    try {
      const response = await axios.get('/api/users/logout');
      console.log('Logout success', response.data);
      toast.success(response.data.message, {
        autoClose: 2000,
        onClose: () => {
          router.push('/login');
        },
      });
    } catch (error: any) {
      console.error('Logout error', error.response);
      toast.error(`Logout with error: ${error.response.data.error}`, {
        autoClose: 2000,
        onClose: () => {
          router.push('/login');
        },
      });
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get('/api/users/me');
      console.log('User profile details', response.data);
      setData(response.data.data);
    } catch (error: any) {
      console.error('User profile details error', error.response);
      toast.error(error.response.data.error, {
        autoClose: 2000,
        onClose: async () => {
          await axios.get('/api/users/logout');
          router.push('/login');
        },
      });
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <ToastContainer
        position='top-center'
        hideProgressBar={true}
        newestOnTop={true}
        limit={3}
        theme='light'
      />
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className='p-3 rounded bg-green-500'>
        {data ? <Link href={`/profile/${data._id}`}>{data.username}</Link> : 'Nothing !'}
      </h2>
      <hr />
      <button
        onClick={onLogout}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded'>
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className='bg-green-500 hover:bg-green-700 text-white font-bold mt-4 py-2 px-4 rounded'>
        Get User Details
      </button>
    </div>
  );
}
