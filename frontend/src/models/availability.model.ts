/**
 * Time Slot Interface
 */
export interface TimeSlot {
  id?: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked?: boolean;
  interviewId?: string;
}

/**
 * Day Availability Interface
 */
export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
  isFullyBooked: boolean;
  availableCount: number;
}

/**
 * Interviewer Availability Response
 */
export interface InterviewerAvailabilityResponse {
  interviewerId: string;
  interviewerName: string;
  startDate: string;
  endDate: string;
  availability: DayAvailability[];
}

/**
 * Set Availability DTO
 */
export interface SetAvailabilityDto {
  availability: Array<{
    date: string;
    slots: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>;
}

/**
 * Calendar View Response
 */
export interface CalendarViewResponse {
  month: number;
  year: number;
  days: Array<{
    date: string;
    dayOfWeek: number;
    isCurrentMonth: boolean;
    availableSlots: number;
    bookedSlots: number;
    hasAvailability: boolean;
  }>;
}

/**
 * Check Availability DTO
 */
export interface CheckAvailabilityDto {
  interviewerIds: string[];
  startTime: string;
  endTime: string;
}

/**
 * Available Interviewers Response
 */
export interface AvailableInterviewersResponse {
  startTime: string;
  endTime: string;
  availableInterviewers: Array<{
    id: string;
    name: string;
    email: string;
    expertise: string;
    yearsOfExperience: number;
  }>;
}
