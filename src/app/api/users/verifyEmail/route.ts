import connectToDatabase from '@/dbConfig/dbConfig';
import User from '@/models/userModel';

import { NextRequest, NextResponse } from 'next/server';

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const token = params.get('token');

    const user = await User.findOne({
      verifyEmailToken: token,
      verifyEmailTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json(
        { message: 'Something went wrong', error: 'Invalid token' },
        { status: 400 }
      );
    }
    user.emailVerified = true;
    user.verifyEmailToken = undefined;
    user.verifyEmailTokenExpiry = undefined;
    await user.save();
    return NextResponse.json(
      { message: 'Email verified successfully', success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('verifyEmail route - error', error);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}
