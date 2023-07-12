// Need to revise the code to support the token expired scenario.
// In this case, jwt.verify() will decode the token even if it has expired. However, if the token has expired,
// jwt.verify() will throw an error with the message “jwt expired”.

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
