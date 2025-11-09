import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FileUploadResponse } from '../models';
import { API_CONFIG, API_ENDPOINTS, FILE_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * File Upload Service
 * Handles file uploads for KYC documents, resumes, and other attachments
 */
@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private http = inject(HttpClient);

  // Signal-based reactive state
  private uploadProgressSignal = signal<number>(0);
  private isUploadingSignal = signal<boolean>(false);

  // Public readonly signals
  readonly uploadProgress = this.uploadProgressSignal.asReadonly();
  readonly isUploading = this.isUploadingSignal.asReadonly();

  /**
   * Upload file to server
   * TODO: Integrate with Spring Boot backend file upload endpoint
   * TODO: Consider using AWS S3 or similar cloud storage for production
   */
  uploadFile(file: File, documentType?: string): Observable<FileUploadResponse> {
    // Validate file
    const validationError = this.validateFile(file);
    if (validationError) {
      return throwError(() => ({ message: validationError }));
    }

    this.isUploadingSignal.set(true);
    this.uploadProgressSignal.set(0);

    const formData = new FormData();
    formData.append('file', file);
    if (documentType) {
      formData.append('documentType', documentType);
    }

    // TODO: Replace with actual backend call
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.FILE.UPLOAD}`;

    // TODO: Implement progress tracking
    return this.http
      .post<FileUploadResponse>(endpoint, formData, {
        reportProgress: true,
        // observe: 'events', // Uncomment to track upload progress
      })
      .pipe(
        tap(() => {
          this.uploadProgressSignal.set(100);
        }),
        catchError((error) => this.handleError(error)),
        tap(() => {
          this.isUploadingSignal.set(false);
          this.uploadProgressSignal.set(0);
        })
      );

    // TODO: Remove mock implementation once backend is ready
    // Mock implementation for development
    // return timer(2000).pipe(
    //   switchMap(() => {
    //     console.log('TODO: Upload file', file.name, 'Type:', documentType);
    //     const mockResponse: ApiResponse<FileUploadResponse> = {
    //       success: true,
    //       data: {
    //         fileUrl: `https://example.com/files/${file.name}`,
    //         fileName: file.name,
    //         fileSize: file.size,
    //         mimeType: file.type,
    //         uploadedAt: new Date(),
    //       },
    //       message: SUCCESS_MESSAGES.FILE_UPLOADED,
    //       timestamp: new Date(),
    //     };
    //     return of(mockResponse);
    //   }),
    //   tap(() => {
    //     this.isUploadingSignal.set(false);
    //     this.uploadProgressSignal.set(0);
    //   })
    // );
  }

  /**
   * Upload multiple files
   * TODO: Implement batch upload with backend
   */
  uploadMultipleFiles(files: File[], documentType?: string): Observable<FileUploadResponse[]> {
    this.isUploadingSignal.set(true);

    // Upload files sequentially to track progress better
    // For parallel uploads, use forkJoin instead
    const uploadObservables = files.map((file) => this.uploadFile(file, documentType));

    // TODO: Implement proper batch upload handling
    console.log('TODO: Implement batch file upload for', files.length, 'files');

    return throwError(() => ({ message: 'Batch upload not yet implemented' }));
  }

  /**
   * Delete file from server
   * TODO: Integrate with Spring Boot backend file deletion endpoint
   */
  deleteFile(fileId: string): Observable<void> {
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.FILE.DELETE(fileId)}`;

    // TODO: Replace with actual backend call
    return this.http.delete<void>(endpoint).pipe(catchError((error) => this.handleError(error)));
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File): string | null {
    // Check file size
    if (file.size > FILE_CONFIG.MAX_FILE_SIZE) {
      return ERROR_MESSAGES.FILE_SIZE_ERROR;
    }

    // Check file type
    if (!this.isValidFileType(file.type)) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }

    // Check file extension
    const extension = this.getFileExtension(file.name);
    if (!FILE_CONFIG.ALLOWED_EXTENSIONS.includes(extension as any)) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }

    return null;
  }

  /**
   * Check if file type is valid
   */
  private isValidFileType(mimeType: string): boolean {
    return FILE_CONFIG.ALLOWED_DOCUMENT_TYPES.includes(mimeType as any);
  }

  /**
   * Get file extension
   */
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot).toLowerCase() : '';
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Get max file size in readable format
   */
  getMaxFileSizeFormatted(): string {
    return this.formatFileSize(FILE_CONFIG.MAX_FILE_SIZE);
  }

  /**
   * Get allowed file types as string
   */
  getAllowedFileTypesString(): string {
    return FILE_CONFIG.ALLOWED_EXTENSIONS.join(', ');
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('File Upload Service error:', error);
    this.isUploadingSignal.set(false);
    this.uploadProgressSignal.set(0);

    let errorMessage: string = ERROR_MESSAGES.FILE_UPLOAD_ERROR;

    if (error.status === 413) {
      errorMessage = ERROR_MESSAGES.FILE_SIZE_ERROR;
    } else if (error.status === 415) {
      errorMessage = ERROR_MESSAGES.INVALID_FILE_TYPE;
    } else if (error.status === 0) {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }

    return throwError(() => ({ message: errorMessage, error }));
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.isUploadingSignal.set(false);
    this.uploadProgressSignal.set(0);
  }
}
