// create a response with JSON body first then set the cookie
// https://codethenporrada.xyz/how-to-set-a-cookie-using-nextjs-13-api-routes

import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { getDataFromToken, TokenType } from '@/helpers/getDataFromToken';

import { NextRequest, NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';

connectToDatabase();

// handle refresh token request
export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value || '';
    const userId = await getDataFromToken({ token: refreshToken, tokenType: TokenType.REFRESH });

    // find user by refresh token
    const foundUser = await User.findOne({ refreshToken }).select('-password');

    // refresh token is valid but user not found - detected refresh token reuse!
    if (!foundUser) {
      const hackedUser = await User.findById(userId).select('-password');
      hackedUser.refreshToken = undefined; // remove refresh token
      await hackedUser.save();
      const res = NextResponse.json(
        { message: 'Something went wrong', error: 'Revoked token reuse detection' },
        { status: 403 } // Forbidden
      );
      return res;
    }

    // refresh token is valid and user found - generate new refresh and access tokens
    const tokenData = {
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
    };

    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined');
    }

    const newAccessToken = await jwt.sign(tokenData, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const newRefreshToken = await jwt.sign(tokenData, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    // refresh token rotation - store the new refresh token in database
    foundUser.refreshToken = newRefreshToken;
    await foundUser.save();

    // send the new access and refresh tokens back to client
    const res = NextResponse.json(
      {
        message: 'Token rotation successful',
        success: true,
      },
      { status: 200 }
    );

    res.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
    });
    res.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 hours (1 day)
    });
    return res;
  } catch (error: any) {
    console.error('token route - error', error);
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
