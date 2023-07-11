import jwt from 'jsonwebtoken';

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
}

interface getDataFromTokenProps {
  token: string;
  tokenType: TokenType;
}

export const getDataFromToken = ({ token, tokenType }: getDataFromTokenProps) => {
  try {
    const decodedToken: any = jwt.verify(
      token,
      tokenType === TokenType.ACCESS
        ? process.env.ACCESS_TOKEN_SECRET!
        : process.env.REFRESH_TOKEN_SECRET!
    );
    return decodedToken.id;
  } catch (error: any) {
    console.error(error);
    throw new Error('Invalid token');
  }
};
