// code does not cover all use cases.
// for example: when accessToken is invalid/missing, how should I handle the refreshToken.

import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { getDataFromToken, TokenType } from '@/helpers/getDataFromToken';

import { NextRequest, NextResponse } from 'next/server';

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value || '';
    const userId = await getDataFromToken({
      token: accessToken,
      tokenType: TokenType.ACCESS,
    });

    // clear the refresh token stored in the database
    const foundUser = await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    foundUser.refreshToken = undefined;
    await foundUser.save();

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
  } catch (error: any) {
    console.error('logout route - error', error);
    const res = NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );

    // clear the cookies on the response object
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');

    return res;
  }
}
