import { useMemo, useState } from 'react';
import type { JobPayload } from '../../types/job';
import { validateJob } from './jobValidation';

export function useJobForm(initial?: Partial<JobPayload>) {
  const [values, setValues] = useState<JobPayload>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    budgetMin: initial?.budgetMin ?? 100,
    budgetMax: initial?.budgetMax ?? 500,
    skills: initial?.skills ?? [],
    experienceLevel: initial?.experienceLevel ?? 'intermediate',
    status: initial?.status ?? 'draft',
  });
  const [skillsInput, setSkillsInput] = useState((initial?.skills ?? []).join(', '));
  const [errors, setErrors] = useState<Partial<Record<keyof JobPayload, string>>>({});

  const normalizedValues = useMemo(
    () => ({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      skills: skillsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    }),
    [values, skillsInput],
  );

  const validate = () => {
    const nextErrors = validateJob(normalizedValues);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  return { values, setValues, skillsInput, setSkillsInput, errors, validate, normalizedValues };
}
