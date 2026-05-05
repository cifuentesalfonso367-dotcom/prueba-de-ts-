import { jwtVerify } from "jose";
import { JwtCustomPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const verifyTokenEdge = async (token: string): Promise<JwtCustomPayload | null> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JwtCustomPayload;
  } catch (error) {
    return null;
  }
};
