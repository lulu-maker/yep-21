import type { JobPayload } from '../../types/job';

export function validateJob(payload: JobPayload) {
  const errors: Partial<Record<keyof JobPayload, string>> = {};

  if (payload.title.trim().length < 10 || payload.title.trim().length > 120) {
    errors.title = 'Title must be between 10 and 120 characters.';
  }

  if (payload.description.trim().length < 50 || payload.description.trim().length > 5000) {
    errors.description = 'Description must be between 50 and 5000 characters.';
  }

  if (payload.budgetMin <= 0 || payload.budgetMax <= 0 || payload.budgetMax < payload.budgetMin) {
    errors.budgetMax = 'Budget values must be positive and max must be greater than or equal to min.';
  }

  if (payload.skills.length < 1 || payload.skills.length > 15) {
    errors.skills = 'Please provide between 1 and 15 skills.';
  }

  if (!payload.experienceLevel) {
    errors.experienceLevel = 'Experience level is required.';
  }

  return errors;
}
