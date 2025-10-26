import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, tap, switchMap, takeUntil } from 'rxjs/operators';
import {
  ApiResponse,
  OTPSendRequest,
  OTPVerificationRequest,
  OTPVerificationResponse,
  OTPType,
} from '../models';
import {
  API_CONFIG,
  API_ENDPOINTS,
  OTP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../constants';

/**
 * OTP Service
 * Handles OTP generation, verification, and management for email and mobile
 */
@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private http = inject(HttpClient);

  // Signal-based reactive state
  private isLoadingSignal = signal<boolean>(false);
  private canResendSignal = signal<boolean>(true);
  private remainingTimeSignal = signal<number>(0);

  // Public readonly signals
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly canResend = this.canResendSignal.asReadonly();
  readonly remainingTime = this.remainingTimeSignal.asReadonly();

  /**
   * Send OTP to email or mobile
   * TODO: Integrate with Spring Boot backend OTP service
   */
  sendOTP(request: OTPSendRequest): Observable<ApiResponse<any>> {
    this.isLoadingSignal.set(true);

    // TODO: Replace with actual backend call
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.OTP.SEND}`;

    return this.http.post<ApiResponse<any>>(endpoint, request).pipe(
      tap((response) => {
        if (response.success) {
          this.startResendCooldown();
        }
      }),
      catchError((error) => this.handleError(error)),
      tap(() => this.isLoadingSignal.set(false))
    );

    // TODO: Remove mock implementation once backend is ready
    // Mock implementation for development
    // return timer(1000).pipe(
    //   switchMap(() => {
    //     console.log('TODO: Send OTP to', request.identifier, 'Type:', request.type);
    //     const response: ApiResponse<any> = {
    //       success: true,
    //       message: SUCCESS_MESSAGES.OTP_SENT,
    //       timestamp: new Date(),
    //     };
    //     this.startResendCooldown();
    //     return of(response);
    //   }),
    //   tap(() => this.isLoadingSignal.set(false))
    // );
  }

  /**
   * Verify OTP
   * TODO: Integrate with Spring Boot backend OTP verification
   */
  verifyOTP(request: OTPVerificationRequest): Observable<ApiResponse<OTPVerificationResponse>> {
    this.isLoadingSignal.set(true);

    // TODO: Replace with actual backend call
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.OTP.VERIFY}`;

    return this.http.post<ApiResponse<OTPVerificationResponse>>(endpoint, request).pipe(
      catchError((error) => this.handleError(error)),
      tap(() => this.isLoadingSignal.set(false))
    );

    // TODO: Remove mock implementation once backend is ready
    // Mock implementation for development
    // return timer(1000).pipe(
    //   switchMap(() => {
    //     console.log('TODO: Verify OTP', request.otp, 'for', request.identifier);
    //     // Mock verification (accept any 6-digit OTP for now)
    //     const isValid = request.otp.length === OTP_CONFIG.LENGTH;
    //     const response: ApiResponse<OTPVerificationResponse> = {
    //       success: isValid,
    //       data: {
    //         verified: isValid,
    //         message: isValid ? SUCCESS_MESSAGES.OTP_VERIFIED : ERROR_MESSAGES.OTP_INVALID,
    //       },
    //       message: isValid ? SUCCESS_MESSAGES.OTP_VERIFIED : ERROR_MESSAGES.OTP_INVALID,
    //       timestamp: new Date(),
    //     };
    //     return of(response);
    //   }),
    //   tap(() => this.isLoadingSignal.set(false))
    // );
  }

  /**
   * Resend OTP
   * TODO: Integrate with Spring Boot backend OTP resend
   */
  resendOTP(request: OTPSendRequest): Observable<ApiResponse<any>> {
    if (!this.canResendSignal()) {
      return throwError(() => ({
        message: `Please wait ${this.remainingTimeSignal()} seconds before resending.`,
      }));
    }

    // TODO: Replace with actual backend call
    const endpoint = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.OTP.RESEND}`;

    return this.sendOTP(request);
  }

  /**
   * Start cooldown timer for OTP resend
   */
  private startResendCooldown(): void {
    this.canResendSignal.set(false);
    this.remainingTimeSignal.set(OTP_CONFIG.RESEND_COOLDOWN / 1000);

    const countdown = timer(0, 1000).pipe(takeUntil(timer(OTP_CONFIG.RESEND_COOLDOWN)));

    countdown.subscribe({
      next: (elapsed) => {
        const remaining = Math.ceil(OTP_CONFIG.RESEND_COOLDOWN / 1000 - elapsed);
        this.remainingTimeSignal.set(remaining);
      },
      complete: () => {
        this.canResendSignal.set(true);
        this.remainingTimeSignal.set(0);
      },
    });
  }

  /**
   * Validate OTP format
   */
  validateOTPFormat(otp: string): boolean {
    return otp.length === OTP_CONFIG.LENGTH && /^\d+$/.test(otp);
  }

  /**
   * Generate OTP request for email
   */
  createEmailOTPRequest(email: string): OTPSendRequest {
    return {
      identifier: email,
      type: OTPType.EMAIL,
    };
  }

  /**
   * Generate OTP request for mobile
   */
  createMobileOTPRequest(mobile: string): OTPSendRequest {
    return {
      identifier: mobile,
      type: OTPType.MOBILE,
    };
  }

  /**
   * Handle service errors
   */
  private handleError(error: any): Observable<never> {
    console.error('OTP Service error:', error);
    this.isLoadingSignal.set(false);

    let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;

    if (error.status === 400) {
      errorMessage = error.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    } else if (error.status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.status === 0) {
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }

    return throwError(() => ({ message: errorMessage, error }));
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.isLoadingSignal.set(false);
    this.canResendSignal.set(true);
    this.remainingTimeSignal.set(0);
  }
}
