'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProfilePage() {
  const router = useRouter();

  const onLogout = async () => {
    const response = await axios.get('/api/users/logout');
    console.log('Logout success', response.data);
    toast.success(response.data.message, {
      autoClose: 2000,
      onClose: () => {
        router.push('/login');
      },
    });
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
      <hr />
      <button
        onClick={onLogout}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded'>
        Logout
      </button>
    </div>
  );
}
