import { VerificationStatus } from './user.model';

/**
 * Recruiter registration data
 */
export interface Recruiter {
  id?: string;
  name: string;
  registrationNumber?: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  description?: string;
  kycDocuments: KYCDocument[];
  verificationStatus: VerificationStatus;
  adminUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Address interface
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * KYC Document metadata
 */
export interface KYCDocument {
  id?: string;
  documentType: KYCDocumentType;
  documentName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
}

/**
 * Types of KYC documents
 */
export enum KYCDocumentType {
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  TAX_CERTIFICATE = 'TAX_CERTIFICATE',
  INCORPORATION_CERTIFICATE = 'INCORPORATION_CERTIFICATE',
  BANK_STATEMENT = 'BANK_STATEMENT',
  OTHER = 'OTHER',
}

/**
 * Recruiter registration request
 */
export interface RecruiterRegistrationRequest {
  name: string;
  registrationNumber?: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  description?: string;
  adminEmail: string;
  adminName: string;
  adminPassword: string;
}
