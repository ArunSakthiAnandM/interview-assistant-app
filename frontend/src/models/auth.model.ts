import { User } from './user.model';

/**
 * Login DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Auth Response (from login/refresh)
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

/**
 * Refresh Token DTO
 */
export interface RefreshTokenDto {
  refreshToken: string;
}

/**
 * Forgot Password DTO
 */
export interface ForgotPasswordDto {
  email: string;
}

/**
 * Reset Password DTO
 */
export interface ResetPasswordDto {
  resetToken: string;
  newPassword: string;
}

/**
 * Change Password DTO
 */
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * Token Payload (decoded JWT)
 */
export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  organisationId?: string;
  iat: number;
  exp: number;
}
