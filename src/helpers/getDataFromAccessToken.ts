import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export const getDataFromAccessToken = (token: string) => {
  try {
    const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    console.error(error);
    return 'Token not valid';
  }
};
