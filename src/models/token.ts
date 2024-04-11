import { TokenType } from "../const/token";

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface TokenGenerateResult {
  id: number;
  token: string;
}

export interface TokenResult {
  userId: number;
  type: TokenType;
}