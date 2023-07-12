// create a response with JSON body first then set the cookie
// https://codethenporrada.xyz/how-to-set-a-cookie-using-nextjs-13-api-routes

import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { NextRequest, NextResponse } from 'next/server';

connectToDatabase();

export async function GET(req: NextRequest) {
  // clear the refresh token stored in the database
  const refreshToken = req.cookies.get('refreshToken')?.value || '';
  const user = await User.findOne({ refreshToken }).select('-password');
  user.refreshToken = undefined;
  await user.save();

  // set the JSON response body and status code
  const res = NextResponse.json(
    {
      message: 'Logout successful',
      success: true,
    },
    { status: 200 }
  );

  // clear the cookies on the response object
  res.cookies.delete('accessToken');
  res.cookies.delete('refreshToken');

  // return the response object
  return res;
}
