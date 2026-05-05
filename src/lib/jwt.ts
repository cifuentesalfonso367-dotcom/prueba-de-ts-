import jwt from 'jsonwebtoken';
import { JwtCustomPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

export function signAccessToken(payload: JwtCustomPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: JwtCustomPayload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtCustomPayload {
  return jwt.verify(token, JWT_SECRET) as JwtCustomPayload;
}

export function verifyRefreshToken(token: string): JwtCustomPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as JwtCustomPayload;
}
