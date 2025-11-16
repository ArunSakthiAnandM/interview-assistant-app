/**
 * Organisation Verification Status
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

/**
 * Organisation Interface
 */
export interface Organisation {
  id: string;
  name: string;
  adminEmail: string;
  adminName?: string;
  phoneNumber?: string;
  address?: string;
  verificationStatus: VerificationStatus;
  kycDocumentUrl?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Organisation Response (from API)
 */
export interface OrganisationResponse extends Organisation {}

/**
 * Register Organisation DTO
 */
export interface RegisterOrganisationDto {
  organisationName: string;
  adminName: string;
  email: string;
  password: string;
  phoneNumber: string;
  address?: string;
  kycDocumentBase64?: string;
}

/**
 * Update Organisation DTO
 */
export interface UpdateOrganisationDto {
  name?: string;
  phoneNumber?: string;
  address?: string;
  kycDocumentBase64?: string;
}

/**
 * Verify Organisation DTO
 */
export interface VerifyOrganisationDto {
  status: VerificationStatus.VERIFIED | VerificationStatus.REJECTED;
  rejectionReason?: string;
}

/**
 * Resubmit Organisation Verification DTO
 */
export interface ResubmitVerificationDto {
  kycDocumentBase64?: string;
  address?: string;
  additionalNotes?: string;
}

/**
 * Verification History Entry
 */
export interface VerificationHistoryEntry {
  id: string;
  status: VerificationStatus;
  reason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerName?: string;
}

/**
 * Organisation Filter Options
 */
export interface OrganisationFilterOptions {
  name?: string;
  verificationStatus?: VerificationStatus;
  adminEmail?: string;
}
