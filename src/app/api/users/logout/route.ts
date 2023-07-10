import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        message: 'Logout successful',
        success: true,
      },
      { status: 200 }
    );

    // delete cookies
    response.cookies.set('accessToken', '', { httpOnly: true, expires: new Date(0) });
    response.cookies.set('refreshToken', '', { httpOnly: true, expires: new Date(0) });

    // return response
    return response;
  } catch (error: any) {
    console.error('logout route - error', error);
    return NextResponse.json(
      { message: 'Something went wrong', error: error.message },
      { status: 500 }
    );
  }
}
