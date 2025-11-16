/**
 * Barrel export for guards
 *
 * Usage in routes:
 * import { authGuard, roleGuard, adminGuard } from './guards';
 */

export { authGuard } from './auth/auth.guard';
export {
  roleGuard,
  adminGuard,
  organisationAdminGuard,
  recruiterGuard,
  interviewerGuard,
  candidateGuard,
  organisationStaffGuard,
  interviewParticipantsGuard,
} from './auth/role.guard';
export { guestGuard } from './auth/guest.guard';
