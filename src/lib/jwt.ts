import jwt from 'jsonwebtoken';
import * as jose from 'jose';

export interface JwtPayload {
  licenseId: string;
  deviceId: string;
  role: string;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  return secret;
};

export const generateToken = (payload: JwtPayload, expiresIn: string | number = '2h'): string => {
  const secret = getSecret();
  return jwt.sign(payload, secret, { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Edge-compatible verification for Middleware
export const edgeVerifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(getSecret());
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
};

export interface AdminJwtPayload {
  username: string;
  role: 'admin';
}

export const generateAdminToken = (payload: AdminJwtPayload): string => {
  const secret = getSecret();
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

export const verifyAdminToken = (token: string): AdminJwtPayload | null => {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret) as AdminJwtPayload;
  } catch (error) {
    return null;
  }
};
