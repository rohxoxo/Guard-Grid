export default {
  SUCCESS: 'The operation has been successful',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  NOT_FOUND: (entity: string) => {
    return `${entity} not found`
  },

  // Guards specific messages
  GUARD_CREATED: 'Guard created successfully',
  GUARD_UPDATED: 'Guard updated successfully',
  GUARD_DELETED: 'Guard terminated successfully',
  GUARD_PERMANENTLY_DELETED: 'Guard permanently deleted successfully',
  GUARD_ASSIGNED_TO_SITE: 'Guard assigned to site successfully',
  GUARD_REMOVED_FROM_SITE: 'Guard removed from site successfully',
  GUARDS_RETRIEVED: 'Guards retrieved successfully',
  GUARD_STATISTICS_RETRIEVED: 'Guard statistics retrieved successfully',
  AVAILABLE_GUARDS_RETRIEVED: 'Available guards retrieved successfully',
  EXPIRING_CERTIFICATIONS_RETRIEVED: 'Guards with expiring certifications retrieved successfully',
  GUARDS_BY_SKILL_RETRIEVED: 'Guards by skill retrieved successfully',
  GUARDS_SEARCH_RESULTS: 'Guard search results retrieved successfully',

  // Validation messages
  VALIDATION_FAILED: 'Validation failed',
  INVALID_GUARD_ID: 'Invalid guard ID format',
  GUARD_ALREADY_EXISTS: 'Guard with this employee ID or email already exists',
  GUARD_NOT_AVAILABLE: 'Guard is not available for assignment',
  GUARD_ALREADY_ASSIGNED: 'Guard is already assigned to this site',
  INACTIVE_GUARD_ASSIGNMENT: 'Cannot assign inactive guard to site',
  SITE_ID_REQUIRED: 'Site ID is required',
  SEARCH_TERM_REQUIRED: 'Search term is required',
  SKILL_REQUIRED: 'Skill parameter is required'
}
