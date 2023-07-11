import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { getDataFromToken, TokenType } from '@/helpers/getDataFromToken';

import { NextRequest, NextResponse } from 'next/server';

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value || '';
    const userId = await getDataFromToken({ token: accessToken, tokenType: TokenType.ACCESS });
    const user = await User.findById(userId).select('-password');
    console.log('me route - user', user);
    return NextResponse.json({ message: 'User found', data: user }, { status: 200 });
  } catch (error: any) {
    console.error('me route - error', error.message);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}
