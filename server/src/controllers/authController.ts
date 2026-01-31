import { Response } from "express";
import { prisma } from "../lib/prisma";
import { comparePassword, hashPassword } from "../lib/password";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { AuthRequest } from "../types";

const refreshExpiry = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export const register = async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  });

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  await prisma.refreshToken.create({
    data: { token: refreshToken, expiresAt: refreshExpiry(), userId: user.id }
  });

  return res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });
  await prisma.refreshToken.create({
    data: { token: refreshToken, expiresAt: refreshExpiry(), userId: user.id }
  });

  return res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken
  });
};

export const refresh = async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }
  try {
    const payload = verifyRefreshToken(refreshToken) as { userId: string };
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });
    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }
    const accessToken = signAccessToken({ userId: payload.userId });
    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
  return res.json({ message: "Logged out" });
};

export const profile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const forgotPassword = async (req: AuthRequest, res: Response) => {
  const { email } = req.body as { email: string };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.json({ message: "If that email exists, a reset link was sent." });
  }
  return res.json({
    message: "Reset email sent (mock).",
    resetLink: `https://example.com/reset?email=${encodeURIComponent(email)}`
  });
};
