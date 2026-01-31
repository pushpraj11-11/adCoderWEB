import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "dev-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "dev-refresh";

export const signAccessToken = (payload: object) =>
  jwt.sign(payload, jwtSecret, { expiresIn: "15m" });

export const signRefreshToken = (payload: object) =>
  jwt.sign(payload, refreshSecret, { expiresIn: "7d" });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, jwtSecret);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret);
