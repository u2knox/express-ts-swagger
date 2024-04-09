import jwt, { Secret } from 'jsonwebtoken';

import type { Token } from '../models/token';

const SECRET: Secret = "mySeCreT";

export const useTokenService = () => {
  const generate = async (id: number): Promise<Token> => {
    return {
      userId: id,
      token: jwt.sign({
        id
      }, SECRET, {
        expiresIn: '1h'
      })
    }
  }

  const verify = async (token: string) => {
    return jwt.verify(token, SECRET);
  }
}