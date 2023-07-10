'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupPage() {
  const router = useRouter();

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  const onSignup = async () => {
    const toastId = toast.loading('Please wait...');
    setLoading(true);

    try {
      const response = await axios.post('/api/users/signup', user);
      console.log('Signup success', response.data);
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
      console.error('Signup failed', error.response);

      toast.update(toastId, {
        render: error.response.data.error,
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.username.length > 0 && user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <ToastContainer
        position='top-center'
        hideProgressBar={true}
        newestOnTop={true}
        limit={3}
        theme='light'
      />
      <h1 className='text-center text-white text-2xl'>{loading ? '' : 'Signup'}</h1>
      <hr />
      <label htmlFor='username'>username</label>
      <input
        className='text-black p-2 border border-gray-500 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
        id='username'
        type='text'
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder='username'
      />
      <label htmlFor='email'>email</label>
      <input
        className='text-black p-2 border border-gray-500 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
        id='email'
        type='email'
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder='email'
      />
      <label htmlFor='password'>password</label>
      <input
        className='text-black p-2 border border-gray-500 rounded-lg mb-4 focus:outline-none focus:border-gray-600'
        id='password'
        type='password'
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder='password'
      />
      <button
        onClick={onSignup}
        disabled={buttonDisabled}
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
        Signup
      </button>
      <Link href='/login'>Visit login page</Link>
    </div>
  );
}
