import type { Dispatch, SetStateAction } from 'react';
import type { JobPayload } from '../../types/job';

interface JobFormFieldsProps {
  values: JobPayload;
  setValues: Dispatch<SetStateAction<JobPayload>>;
  skillsInput: string;
  setSkillsInput: (value: string) => void;
  errors: Partial<Record<keyof JobPayload, string>>;
}

export function JobFormFields({ values, setValues, skillsInput, setSkillsInput, errors }: JobFormFieldsProps) {
  return (
    <>
      <label>
        Title
        <input value={values.title} onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))} />
        {errors.title ? <span className="field-error">{errors.title}</span> : null}
      </label>

      <label>
        Description
        <textarea
          rows={8}
          value={values.description}
          onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
        />
        {errors.description ? <span className="field-error">{errors.description}</span> : null}
      </label>


      <label>
        Category (optional)
        <input
          value={values.category ?? ''}
          onChange={(e) => setValues((prev) => ({ ...prev, category: e.target.value }))}
        />
      </label>

      <div className="two-col-grid">
        <label>
          Budget min
          <input
            type="number"
            min={1}
            value={values.budgetMin}
            onChange={(e) => setValues((prev) => ({ ...prev, budgetMin: Number(e.target.value) }))}
          />
        </label>
        <label>
          Budget max
          <input
            type="number"
            min={1}
            value={values.budgetMax}
            onChange={(e) => setValues((prev) => ({ ...prev, budgetMax: Number(e.target.value) }))}
          />
          {errors.budgetMax ? <span className="field-error">{errors.budgetMax}</span> : null}
        </label>
      </div>

      <label>
        Required skills (comma separated)
        <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
        {errors.skills ? <span className="field-error">{errors.skills}</span> : null}
      </label>

      <label>
        Experience level
        <select
          value={values.experienceLevel}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, experienceLevel: e.target.value as JobPayload['experienceLevel'] }))
          }
        >
          <option value="entry">Entry</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
        {errors.experienceLevel ? <span className="field-error">{errors.experienceLevel}</span> : null}
      </label>
    </>
  );
}
