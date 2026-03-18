import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../../api/jobsApi';
import { JobFormFields } from '../../../components/jobs/JobFormFields';
import { useAuth } from '../../../contexts/AuthContext';
import { useJobForm } from '../../../features/jobs/useJobForm';

export function ClientJobCreatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { values, setValues, skillsInput, setSkillsInput, errors, validate, normalizedValues } = useJobForm();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user || !validate() || isSaving) {
      return;
    }

    setFormError(null);
    setIsSaving(true);

    try {
      const job = await createJob(user.id, normalizedValues);
      navigate(`/client/jobs/${job.id}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create job.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container account-grid">
      <h1>Create Job</h1>
      <form className="form-stack info-card" onSubmit={onSubmit} noValidate>
        <JobFormFields
          values={values}
          setValues={setValues}
          skillsInput={skillsInput}
          setSkillsInput={setSkillsInput}
          errors={errors}
        />

        <label>
          Initial status
          <select
            value={values.status}
            onChange={(e) => setValues((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))}
          >
            <option value="draft">Draft</option>
            <option value="open">Open</option>
          </select>
        </label>

        {formError ? <p className="field-error">{formError}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create job'}
        </button>
      </form>
    </div>
  );
}
