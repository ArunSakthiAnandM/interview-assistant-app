import { Injectable, signal, computed } from '@angular/core';
import { Interview, InterviewStatus, Candidate } from '../models';

/**
 * Interview filter options
 */
export interface InterviewFilters {
  status?: InterviewStatus | InterviewStatus[];
  interviewerId?: string;
  candidateId?: string;
  recruiterId?: string;
  startDate?: Date;
  endDate?: Date;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

/**
 * Global Interview Store
 * Manages interview-related state using Angular Signals
 */
@Injectable({
  providedIn: 'root',
})
export class InterviewStore {
  // Private writable signals
  private _interviews = signal<Interview[]>([]);
  private _selectedInterview = signal<Interview | null>(null);
  private _filters = signal<InterviewFilters>({});
  private _isLoading = signal<boolean>(false);

  // Public readonly signals
  readonly interviews = this._interviews.asReadonly();
  readonly selectedInterview = this._selectedInterview.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed signals
  readonly filteredInterviews = computed(() => {
    const interviews = this._interviews();
    const filters = this._filters();

    return interviews.filter((interview) => {
      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(interview.status)) {
          return false;
        }
      }

      if (filters.recruiterId && interview.recruiterId !== filters.recruiterId) {
        return false;
      }

      // Interviewer filter
      if (filters.interviewerId && !interview.interviewerIds.includes(filters.interviewerId)) {
        return false;
      }

      // Candidate filter
      if (filters.candidateId && interview.candidateId !== filters.candidateId) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && interview.scheduledDate) {
        if (new Date(interview.scheduledDate) < filters.dateFrom) {
          return false;
        }
      }

      if (filters.dateTo && interview.scheduledDate) {
        if (new Date(interview.scheduledDate) > filters.dateTo) {
          return false;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const searchableText = `${interview.title} ${interview.description}`.toLowerCase();
        if (!searchableText.includes(term)) {
          return false;
        }
      }

      return true;
    });
  });

  readonly upcomingInterviews = computed(() => {
    const now = new Date();
    return this.filteredInterviews().filter(
      (interview) =>
        interview.scheduledDate &&
        new Date(interview.scheduledDate) > now &&
        interview.status === InterviewStatus.SCHEDULED
    );
  });

  readonly completedInterviews = computed(() =>
    this.filteredInterviews().filter((interview) => interview.status === InterviewStatus.COMPLETED)
  );

  readonly totalInterviews = computed(() => this._interviews().length);
  readonly filteredCount = computed(() => this.filteredInterviews().length);

  /**
   * Set interviews
   */
  setInterviews(interviews: Interview[]): void {
    this._interviews.set(interviews);
  }

  /**
   * Add interview
   */
  addInterview(interview: Interview): void {
    this._interviews.update((interviews) => [...interviews, interview]);
  }

  /**
   * Update interview
   */
  updateInterview(id: string, updates: Partial<Interview>): void {
    this._interviews.update((interviews) =>
      interviews.map((interview) =>
        interview.id === id ? { ...interview, ...updates } : interview
      )
    );
  }

  /**
   * Remove interview
   */
  removeInterview(id: string): void {
    this._interviews.update((interviews) => interviews.filter((interview) => interview.id !== id));
  }

  /**
   * Select interview
   */
  selectInterview(interview: Interview | null): void {
    this._selectedInterview.set(interview);
  }

  /**
   * Set filters
   */
  setFilters(filters: InterviewFilters): void {
    this._filters.set(filters);
  }

  /**
   * Update filters
   */
  updateFilters(partialFilters: Partial<InterviewFilters>): void {
    this._filters.update((currentFilters) => ({
      ...currentFilters,
      ...partialFilters,
    }));
  }

  /**
   * Clear filters
   */
  clearFilters(): void {
    this._filters.set({});
  }

  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this._isLoading.set(isLoading);
  }

  /**
   * Clear store
   */
  clear(): void {
    this._interviews.set([]);
    this._selectedInterview.set(null);
    this._filters.set({});
    this._isLoading.set(false);
  }
}
