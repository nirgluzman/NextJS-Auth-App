'use client';

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Axios } from 'axios';

export default function SignupPage() {
  const [user, setUser] = React.useState({
    username: '',
    email: '',
    password: '',
  });

  const onSignup = async () => {};

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-center text-white text-2xl'>Signup</h1>
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
        className='p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600'>
        Signup
      </button>
      <Link href='/login'>Visit login page</Link>
    </div>
  );
}
