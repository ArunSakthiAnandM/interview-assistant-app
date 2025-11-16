import { UserRole } from './user.model';

/**
 * Invitation Status
 */
export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

/**
 * Invitation Interface
 */
export interface Invitation {
  id: string;
  organisationId: string;
  organisationName?: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  expiryDate: string;
  sentBy?: string;
  sentByName?: string;
  canExtend?: boolean;
  createdAt: string;
}

/**
 * Invitation Response (from API)
 */
export interface InvitationResponse extends Invitation {}

/**
 * Send Invitation DTO
 */
export interface SendInvitationDto {
  email: string;
  role: UserRole;
  expiryDays: number;
}

/**
 * Extend Invitation DTO
 */
export interface ExtendInvitationDto {
  additionalDays: number;
}

/**
 * Bulk Send Invitations DTO
 */
export interface BulkSendInvitationsDto {
  invitations: SendInvitationDto[];
}

/**
 * Bulk Send Result
 */
export interface BulkSendResult {
  sent: number;
  failed: Array<{
    email: string;
    reason: string;
  }>;
}
