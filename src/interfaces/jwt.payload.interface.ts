export interface IJWTPayload {
  userId: number;
  username: string;
  referralCode: string;
}

export interface IJWTDecoded extends IJWTPayload {
  iat: number;
  exp: number;
}
