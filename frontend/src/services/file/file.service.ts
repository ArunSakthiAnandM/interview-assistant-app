import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { FileMetadata, FileEntityType } from '../../models/file.model';
import { NotificationService } from '../notification/notification.service';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/app-config';

/**
 * File Upload Progress
 */
export interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}

/**
 * File Service
 *
 * Handles file operations:
 * - Upload files with progress tracking
 * - Download files
 * - Delete files
 * - Validate file types and sizes
 * - Preview file URLs
 */
@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  // File size limits (in bytes)
  private readonly MAX_FILE_SIZES = {
    RESUME: 5 * 1024 * 1024, // 5MB
    KYC_DOCUMENT: 10 * 1024 * 1024, // 10MB
    PROFILE_PICTURE: 2 * 1024 * 1024, // 2MB
  };

  // Allowed file types
  private readonly ALLOWED_TYPES = {
    RESUME: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    KYC_DOCUMENT: ['application/pdf', 'image/jpeg', 'image/png'],
    PROFILE_PICTURE: ['image/jpeg', 'image/png', 'image/gif'],
  };

  /**
   * Upload a file with progress tracking
   */
  uploadFile(
    file: File,
    fileType: FileEntityType,
    relatedEntityId?: string
  ): Observable<FileMetadata | UploadProgress> {
    // Validate file
    const validation = this.validateFile(file, fileType);
    if (!validation.isValid) {
      this.notificationService.showError(validation.error!);
      return throwError(() => new Error(validation.error));
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    if (relatedEntityId) {
      formData.append('relatedEntityId', relatedEntityId);
    }

    // Upload with progress
    return this.http
      .post<FileMetadata>(API_ENDPOINTS.FILES.UPLOAD, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => this.handleUploadEvent(event)),
        catchError((error) => {
          this.notificationService.showError(ERROR_MESSAGES.FILE_UPLOAD_ERROR);
          return throwError(() => error);
        })
      );
  }

  /**
   * Upload multiple files
   */
  uploadMultipleFiles(
    files: File[],
    fileType: FileEntityType,
    relatedEntityId?: string
  ): Observable<FileMetadata[] | UploadProgress> {
    const formData = new FormData();

    // Validate and append all files
    for (let i = 0; i < files.length; i++) {
      const validation = this.validateFile(files[i], fileType);
      if (!validation.isValid) {
        this.notificationService.showError(validation.error!);
        return throwError(() => new Error(validation.error));
      }
      formData.append('files', files[i]);
    }

    formData.append('fileType', fileType);
    if (relatedEntityId) {
      formData.append('relatedEntityId', relatedEntityId);
    }

    return this.http
      .post<FileMetadata[]>(API_ENDPOINTS.FILES.UPLOAD, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event) => this.handleUploadEvent(event)),
        catchError((error) => {
          this.notificationService.showError(ERROR_MESSAGES.FILE_UPLOAD_ERROR);
          return throwError(() => error);
        })
      );
  }

  /**
   * Download a file
   */
  downloadFile(fileId: string, filename: string): Observable<Blob> {
    return this.http
      .get(API_ENDPOINTS.FILES.DOWNLOAD(fileId), {
        responseType: 'blob',
      })
      .pipe(
        map((blob) => {
          this.triggerDownload(blob, filename);
          return blob;
        }),
        catchError((error) => {
          this.notificationService.showError(ERROR_MESSAGES.FILE_DOWNLOAD_ERROR);
          return throwError(() => error);
        })
      );
  }

  /**
   * Get file preview URL
   */
  getPreviewUrl(fileId: string): string {
    return API_ENDPOINTS.FILES.PREVIEW(fileId);
  }

  /**
   * Delete a file
   */
  deleteFile(fileId: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.FILES.DELETE(fileId)).pipe(
      map(() => {
        this.notificationService.showSuccess(SUCCESS_MESSAGES.FILE_DELETED);
      }),
      catchError((error) => {
        this.notificationService.showError('Failed to delete file');
        return throwError(() => error);
      })
    );
  }

  /**
   * Get file metadata
   */
  getFileMetadata(fileId: string): Observable<FileMetadata> {
    return this.http.get<FileMetadata>(API_ENDPOINTS.FILES.PREVIEW(fileId));
  }

  /**
   * Validate file type and size
   */
  private validateFile(file: File, fileType: FileEntityType): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = this.ALLOWED_TYPES[fileType as keyof typeof this.ALLOWED_TYPES];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${this.getReadableFileTypes(fileType)}`,
      };
    }

    // Check file size
    const maxSize = this.MAX_FILE_SIZES[fileType as keyof typeof this.MAX_FILE_SIZES];
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds limit of ${this.formatBytes(maxSize)}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Handle upload event and extract progress or response
   */
  private handleUploadEvent(event: HttpEvent<any>): FileMetadata | UploadProgress | any {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        if (event.total) {
          return {
            percentage: Math.round((100 * event.loaded) / event.total),
            loaded: event.loaded,
            total: event.total,
          } as UploadProgress;
        }
        return { percentage: 0, loaded: event.loaded, total: 0 };

      case HttpEventType.Response:
        if (event.body) {
          this.notificationService.showSuccess(SUCCESS_MESSAGES.FILE_UPLOADED);
        }
        return event.body;

      default:
        return event;
    }
  }

  /**
   * Trigger browser download
   */
  private triggerDownload(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Get readable file type names
   */
  private getReadableFileTypes(fileType: FileEntityType): string {
    const types = this.ALLOWED_TYPES[fileType as keyof typeof this.ALLOWED_TYPES];
    return types
      .map((type: string) => {
        const ext = type.split('/')[1];
        return ext.toUpperCase();
      })
      .join(', ');
  }

  /**
   * Format bytes to readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Check if file is an image
   */
  isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  /**
   * Check if file is a PDF
   */
  isPDF(mimeType: string): boolean {
    return mimeType === 'application/pdf';
  }

  /**
   * Check if file can be previewed in browser
   */
  canPreview(mimeType: string): boolean {
    return this.isImage(mimeType) || this.isPDF(mimeType);
  }
}
