import jwt, { Secret } from "jsonwebtoken";

import { TokenType } from "../const/token";

import type { Token, TokenGenerateResult, TokenResult } from "../models/token";

import { prisma } from "./prismaService";

const SECRET: Secret = "mySeCreT";

export const useTokenService = () => {
  const createToken = (
    userId: number,
    type: TokenType,
    expiresIn: string
  ): string => {
    return jwt.sign(
      {
        userId,
        type,
      },
      SECRET,
      {
        expiresIn,
      }
    );
  };

  const verifyAsync = (token: string): Promise<TokenResult> => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, SECRET, (err, decoded) => {
        if (decoded) {
          resolve(decoded as TokenResult);
        } else {
          reject(err);
        }
      });
    });
  };

  const generateToken = async (
    userId: number,
    type: TokenType,
    parentTokenId?: number
  ): Promise<TokenGenerateResult | null> => {
    const token = createToken(
      userId,
      type,
      type === TokenType.REFRESH_TOKEN ? "2 days" : "1h"
    );

    const result = await prisma.token.create({
      data: {
        date: new Date().toISOString(),
        token,
        userId,
        type: type,
        parent:
          type === TokenType.ACCESS_TOKEN
            ? {
                connect: {
                  id: parentTokenId,
                },
              }
            : undefined,
      },
    });

    return result
      ? {
          id: result.id,
          token,
        }
      : null;
  };

  const generatePair = async (userId: number): Promise<Token> => {
    const refreshToken = await generateToken(userId, TokenType.REFRESH_TOKEN);
    const accessToken = await generateToken(
      userId,
      TokenType.ACCESS_TOKEN,
      refreshToken.id
    );

    return {
      refreshToken: refreshToken.token,
      accessToken: accessToken.token,
    };
  };

  const verify = async (
    token: string,
    type: TokenType = TokenType.ACCESS_TOKEN
  ) => {
    try {
      const tokenData = await verifyAsync(token);
      if (tokenData.type !== type) {
        return false;
      }
      

      const tokenInfo = await prisma.token.findFirst({
        where: { token, userId: tokenData.userId },
      });

      return tokenInfo?.userId;
    } catch {
      return false;
    }
  };

  const removeTokens = async (token: string) => {
    const tokenInfo = await prisma.token.findFirst({
      where: { token },
    });

    if (!tokenInfo) {
      return false;
    }

    await prisma.token.deleteMany({
      where: {
        parent: {
          some: {
            id: tokenInfo.id,
          },
        },
        userId: tokenInfo.userId,
      },
    });
    await prisma.token.delete({
      where: {
        id: tokenInfo.id,
      },
    });
    return tokenInfo.userId;
  };

  const logOut = async (token: string) => {
    const tokenInfo = await prisma.token.findFirst({
      where: { 
        token,
        type: TokenType.ACCESS_TOKEN
      },
      include: {
        parent: true,
      }
    });

    if (!tokenInfo) {
      return false;
    }

    await prisma.token.deleteMany({
      where: {
        parent: {
          some: {
            id: tokenInfo.parent[0].id,
          },
        },
        userId: tokenInfo.userId,
      },
    });
    await prisma.token.delete({
      where: {
        id: tokenInfo.parent[0].id,
      },
    });
    return tokenInfo.userId;
  }

  return { generatePair, generateToken, verify, removeTokens, logOut };
};
