import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_CONFIG } from '../constants';
import { NotificationStore } from '../store/notification.store';

/**
 * Email notification type
 */
export enum EmailNotificationType {
  INTERVIEW_INVITATION = 'INTERVIEW_INVITATION',
  INTERVIEW_REMINDER = 'INTERVIEW_REMINDER',
  INTERVIEW_CANCELLED = 'INTERVIEW_CANCELLED',
  INTERVIEW_RESCHEDULED = 'INTERVIEW_RESCHEDULED',
  INTERVIEW_FEEDBACK = 'INTERVIEW_FEEDBACK',
  CANDIDATE_SELECTED = 'CANDIDATE_SELECTED',
  CANDIDATE_REJECTED = 'CANDIDATE_REJECTED',
  RECRUITER_VERIFIED = 'RECRUITER_VERIFIED',
  RECRUITER_REJECTED = 'RECRUITER_REJECTED',
  WELCOME = 'WELCOME',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

/**
 * SMS notification type
 */
export enum SMSNotificationType {
  INTERVIEW_REMINDER = 'INTERVIEW_REMINDER',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  INTERVIEW_CANCELLED = 'INTERVIEW_CANCELLED',
  URGENT_UPDATE = 'URGENT_UPDATE',
}

/**
 * Email notification request
 */
export interface EmailNotificationRequest {
  to: string | string[];
  type: EmailNotificationType;
  data: Record<string, any>;
  cc?: string[];
  bcc?: string[];
}

/**
 * SMS notification request
 */
export interface SMSNotificationRequest {
  to: string | string[];
  type: SMSNotificationType;
  data: Record<string, any>;
}

/**
 * Notification Service
 * Handles email and SMS notifications
 * TODO: Integrate with backend notification service (SendGrid, Twilio, etc.)
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  private notificationStore = inject(NotificationStore);

  private readonly EMAIL_ENDPOINT = `${API_CONFIG.BASE_URL}/notifications/email`;
  private readonly SMS_ENDPOINT = `${API_CONFIG.BASE_URL}/notifications/sms`;

  /**
   * Send email notification
   * TODO: Integrate with Spring Boot backend notification service
   * Backend should integrate with SendGrid, AWS SES, or similar
   */
  sendEmail(request: EmailNotificationRequest): Observable<void> {
    console.log('TODO: Send email notification', request);

    // TODO: Replace with actual backend call
    return this.http.post<void>(this.EMAIL_ENDPOINT, request).pipe(
      tap(() => {
        this.notificationStore.success('Email sent successfully');
      }),
      catchError((error) => {
        console.error('Failed to send email:', error);
        this.notificationStore.error('Failed to send email');
        throw error;
      })
    );
  }

  /**
   * Send SMS notification
   * TODO: Integrate with Spring Boot backend SMS service
   * Backend should integrate with Twilio or similar
   */
  sendSMS(request: SMSNotificationRequest): Observable<void> {
    console.log('TODO: Send SMS notification', request);

    // TODO: Replace with actual backend call
    return this.http.post<void>(this.SMS_ENDPOINT, request).pipe(
      tap(() => {
        this.notificationStore.success('SMS sent successfully');
      }),
      catchError((error) => {
        console.error('Failed to send SMS:', error);
        this.notificationStore.error('Failed to send SMS');
        throw error;
      })
    );
  }

  /**
   * Send interview invitation email
   */
  sendInterviewInvitation(
    candidateEmail: string,
    interviewDetails: {
      interviewId: string;
      title: string;
      scheduledDate: Date;
      location: string;
      interviewLink: string;
    }
  ): Observable<void> {
    return this.sendEmail({
      to: candidateEmail,
      type: EmailNotificationType.INTERVIEW_INVITATION,
      data: interviewDetails,
    });
  }

  /**
   * Send interview reminder (24 hours before)
   */
  sendInterviewReminder(
    candidateEmail: string,
    candidateMobile: string,
    interviewDetails: {
      title: string;
      scheduledDate: Date;
      location: string;
    }
  ): void {
    // Send email reminder
    this.sendEmail({
      to: candidateEmail,
      type: EmailNotificationType.INTERVIEW_REMINDER,
      data: interviewDetails,
    }).subscribe();

    // Send SMS reminder
    this.sendSMS({
      to: candidateMobile,
      type: SMSNotificationType.INTERVIEW_REMINDER,
      data: interviewDetails,
    }).subscribe();
  }

  /**
   * Send interview cancellation notification
   */
  sendInterviewCancellation(
    candidateEmail: string,
    candidateMobile: string,
    interviewDetails: {
      title: string;
      reason: string;
    }
  ): void {
    // Send email
    this.sendEmail({
      to: candidateEmail,
      type: EmailNotificationType.INTERVIEW_CANCELLED,
      data: interviewDetails,
    }).subscribe();

    // Send SMS
    this.sendSMS({
      to: candidateMobile,
      type: SMSNotificationType.INTERVIEW_CANCELLED,
      data: interviewDetails,
    }).subscribe();
  }

  /**
   * Send interview feedback to candidate
   */
  sendInterviewFeedback(
    candidateEmail: string,
    feedback: {
      interviewTitle: string;
      outcome: string;
      message: string;
    }
  ): Observable<void> {
    return this.sendEmail({
      to: candidateEmail,
      type: EmailNotificationType.INTERVIEW_FEEDBACK,
      data: feedback,
    });
  }

  /**
   * Send candidate selection notification
   */
  sendCandidateSelected(
    candidateEmail: string,
    details: {
      interviewTitle: string;
      nextSteps: string;
      contactPerson: string;
      contactEmail: string;
    }
  ): Observable<void> {
    return this.sendEmail({
      to: candidateEmail,
      type: EmailNotificationType.CANDIDATE_SELECTED,
      data: details,
    });
  }

  /**
   * Send candidate rejection notification
   */
  sendCandidateRejected(
    candidateEmail: string,
    details: {
      interviewTitle: string;
      message: string;
    }
  ): Observable<void> {
    return this.sendEmail({
      to: candidateEmail,
      type: EmailNotificationType.CANDIDATE_REJECTED,
      data: details,
    });
  }

  /**
   * Send recruiter verification notification
   */
  sendRecruiterVerified(adminEmail: string, recruiterName: string): Observable<void> {
    return this.sendEmail({
      to: adminEmail,
      type: EmailNotificationType.RECRUITER_VERIFIED,
      data: { recruiterName },
    });
  }

  /**
   * Send recruiter rejection notification
   */
  sendRecruiterRejected(
    adminEmail: string,
    recruiterName: string,
    reason: string
  ): Observable<void> {
    return this.sendEmail({
      to: adminEmail,
      type: EmailNotificationType.RECRUITER_REJECTED,
      data: { recruiterName, reason },
    });
  }

  /**
   * Send welcome email to new user
   */
  sendWelcomeEmail(email: string, userName: string, userType: string): Observable<void> {
    return this.sendEmail({
      to: email,
      type: EmailNotificationType.WELCOME,
      data: { userName, userType },
    });
  }

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string, resetToken: string, resetLink: string): Observable<void> {
    return this.sendEmail({
      to: email,
      type: EmailNotificationType.PASSWORD_RESET,
      data: { resetToken, resetLink },
    });
  }
}
