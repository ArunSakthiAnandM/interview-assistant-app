import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileUploadService } from '../../../services/file-upload.service';
import { FILE_CONFIG } from '../../../constants';

/**
 * File Upload Component
 * Reusable component for uploading files with drag-and-drop support
 */
@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss',
})
export class FileUploadComponent {
  // Inputs
  accept = input<string>(FILE_CONFIG.ALLOWED_EXTENSIONS.join(','));
  multiple = input<boolean>(false);
  maxSize = input<number>(FILE_CONFIG.MAX_FILE_SIZE);
  label = input<string>('Upload File');

  // Outputs
  fileSelected = output<File>();
  filesSelected = output<File[]>();
  uploadError = output<string>();

  // Signals
  isDragging = signal<boolean>(false);
  selectedFileName = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private fileUploadService: FileUploadService) {}

  /**
   * Handle file input change
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(Array.from(input.files));
    }
  }

  /**
   * Handle drag over event
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  /**
   * Handle drag leave event
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  /**
   * Handle file drop event
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  /**
   * Handle selected files
   */
  private handleFiles(files: File[]): void {
    this.errorMessage.set(null);

    // Validate each file
    for (const file of files) {
      const validationError = this.fileUploadService.validateFile(file);
      if (validationError) {
        this.errorMessage.set(validationError);
        this.uploadError.emit(validationError);
        return;
      }
    }

    // Emit files
    if (files.length === 1) {
      this.selectedFileName.set(files[0].name);
      this.fileSelected.emit(files[0]);
    } else if (files.length > 1 && this.multiple()) {
      this.selectedFileName.set(`${files.length} files selected`);
      this.filesSelected.emit(files);
    } else {
      this.errorMessage.set('Only single file upload is allowed');
      this.uploadError.emit('Only single file upload is allowed');
    }
  }

  /**
   * Clear selected file
   */
  clearFile(): void {
    this.selectedFileName.set(null);
    this.errorMessage.set(null);
  }

  /**
   * Get max file size as formatted string
   */
  get maxSizeFormatted(): string {
    return this.fileUploadService.formatFileSize(this.maxSize());
  }

  /**
   * Get allowed file types
   */
  get allowedTypes(): string {
    return this.fileUploadService.getAllowedFileTypesString();
  }
}
