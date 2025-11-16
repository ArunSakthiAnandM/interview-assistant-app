/**
 * File Entity Type
 */
export enum FileEntityType {
  RESUME = 'RESUME',
  KYC_DOCUMENT = 'KYC_DOCUMENT',
  FEEDBACK_ATTACHMENT = 'FEEDBACK_ATTACHMENT',
  OTHER = 'OTHER',
}

/**
 * File Metadata Interface
 */
export interface FileMetadata {
  id: string;
  entityType: FileEntityType;
  entityId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  version: number;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedAt: string;
}

/**
 * File Version History
 */
export interface FileVersionHistory {
  entityType: FileEntityType;
  entityId: string;
  versions: FileMetadata[];
  currentVersion: number;
}

/**
 * File Upload DTO
 */
export interface FileUploadDto {
  file: File;
  entityType: FileEntityType;
  entityId: string;
}

/**
 * File Upload Progress
 */
export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

/**
 * File Preview Response
 */
export interface FilePreviewResponse {
  url: string;
  fileName: string;
  mimeType: string;
  expiresAt: string;
}

/**
 * Bulk Delete Files DTO
 */
export interface BulkDeleteFilesDto {
  fileIds: string[];
}

/**
 * Bulk Delete Result
 */
export interface BulkDeleteResult {
  deleted: number;
  failed: string[];
}

/**
 * Allowed File Types Configuration
 */
export interface AllowedFileTypes {
  [FileEntityType.RESUME]: string[];
  [FileEntityType.KYC_DOCUMENT]: string[];
  [FileEntityType.FEEDBACK_ATTACHMENT]: string[];
  [FileEntityType.OTHER]: string[];
}

/**
 * File Size Limits Configuration (in bytes)
 */
export interface FileSizeLimits {
  [FileEntityType.RESUME]: number;
  [FileEntityType.KYC_DOCUMENT]: number;
  [FileEntityType.FEEDBACK_ATTACHMENT]: number;
  [FileEntityType.OTHER]: number;
}
