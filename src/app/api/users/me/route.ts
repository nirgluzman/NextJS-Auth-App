import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { getDataFromAccessToken } from '@/helpers/getDataFromAccessToken';

import { NextRequest, NextResponse } from 'next/server';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

connectToDatabase();

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get('accessToken')?.value || '';
    const userId = await getDataFromAccessToken(accessToken);
    const user = await User.findById(userId).select('-password');
    console.log('me route - user', user);
    return NextResponse.json({ message: 'User found', data: user }, { status: 200 });
  } catch (error: any) {
    console.error('me route - error', error);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}
