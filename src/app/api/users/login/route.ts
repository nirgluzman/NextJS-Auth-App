import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { NextRequest, NextResponse } from 'next/server';

import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    console.log('login route - reqBody', reqBody);
    const { email, password } = reqBody;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: 'Something went wrong',
          error: 'Email or password you entered is incorrect',
        },
        { status: 400 }
      );
    }

    // check if email has been verified
    if (!user.emailVerified) {
      return NextResponse.json(
        { message: 'Something went wrong', error: 'Email verification is required' },
        { status: 400 }
      );
    }

    // check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: 'Something went wrong', error: 'Email or password you entered is incorrect' },
        { status: 400 }
      );
    }

    // create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // create JWT token
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error('ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined');
    }

    const accessToken = await jwt.sign(tokenData, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = await jwt.sign(tokenData, REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    // store refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json(
      {
        message: 'Login successful',
        success: true,
      },
      { status: 200 }
    );

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 60 * 60, // 1 hour
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 hours (1 day)
    });

    // return response
    return response;
  } catch (error: any) {
    console.error('login route - error', error);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}
