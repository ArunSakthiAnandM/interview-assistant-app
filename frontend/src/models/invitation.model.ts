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
  invitedRole: UserRole; // Backend returns invitedRole, not role
  status: InvitationStatus;
  expiryDays?: number;
  expiryDate: string;
  invitedBy?: string;
  sentBy?: string; // Alias for invitedBy for backward compatibility
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
  role: UserRole; // Request uses 'role', backend expects this
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
