import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import {
  Invitation,
  InvitationStatus,
  SendInvitationDto,
  BulkSendInvitationsDto,
  BulkSendResult,
} from '../../models/invitation.model';
import { PaginatedResponse } from '../../models/common.model';

/**
 * Invitation Service
 *
 * Handles user invitation operations including sending,
 * accepting, declining, and managing invitations.
 */
@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private http = inject(HttpClient);

  /**
   * Send invitation to a user
   */
  send(data: SendInvitationDto): Observable<Invitation> {
    return this.http.post<Invitation>(API_ENDPOINTS.INVITATIONS.SEND, data);
  }

  /**
   * Send multiple invitations at once
   */
  bulkSend(data: BulkSendInvitationsDto): Observable<BulkSendResult> {
    return this.http.post<BulkSendResult>(API_ENDPOINTS.INVITATIONS.BULK_SEND, data);
  }

  /**
   * Get invitation by ID
   */
  getById(id: string): Observable<Invitation> {
    return this.http.get<Invitation>(API_ENDPOINTS.INVITATIONS.DETAIL(id));
  }

  /**
   * Get all invitations (with filters)
   */
  getAll(
    page: number = 0,
    size: number = 20,
    status?: InvitationStatus,
    organisationId?: string
  ): Observable<PaginatedResponse<Invitation>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (organisationId) {
      params = params.set('organisationId', organisationId);
    }

    return this.http.get<PaginatedResponse<Invitation>>(API_ENDPOINTS.INVITATIONS.BASE, { params });
  }

  /**
   * Get my invitations (for current user)
   */
  getMy(
    page: number = 0,
    size: number = 20,
    status?: InvitationStatus
  ): Observable<PaginatedResponse<Invitation>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Invitation>>(API_ENDPOINTS.INVITATIONS.MY, { params });
  }

  /**
   * Get invitations by organisation
   */
  getByOrganisation(
    organisationId: string,
    page: number = 0,
    size: number = 20,
    status?: InvitationStatus
  ): Observable<PaginatedResponse<Invitation>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Invitation>>(
      API_ENDPOINTS.INVITATIONS.BY_ORGANISATION(organisationId),
      { params }
    );
  }

  /**
   * Accept invitation
   */
  accept(id: string): Observable<Invitation> {
    return this.http.post<Invitation>(API_ENDPOINTS.INVITATIONS.ACCEPT(id), {});
  }

  /**
   * Decline invitation
   */
  decline(id: string, reason?: string): Observable<Invitation> {
    return this.http.post<Invitation>(API_ENDPOINTS.INVITATIONS.DECLINE(id), { reason });
  }

  /**
   * Extend invitation expiry
   */
  extend(id: string, additionalDays: number): Observable<Invitation> {
    return this.http.post<Invitation>(API_ENDPOINTS.INVITATIONS.EXTEND(id), { additionalDays });
  }

  /**
   * Delete invitation
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(API_ENDPOINTS.INVITATIONS.DETAIL(id));
  }
}
