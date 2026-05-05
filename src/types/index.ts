import type { Role } from "@prisma/client";

export interface JwtCustomPayload {
  userId: string | number;
  name?: string;
  email: string;
  role: Role;
}

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}