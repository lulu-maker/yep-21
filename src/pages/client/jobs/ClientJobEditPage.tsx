import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob } from '../../../api/jobsApi';
import { JobFormFields } from '../../../components/jobs/JobFormFields';
import { useAuth } from '../../../contexts/AuthContext';
import { useJobForm } from '../../../features/jobs/useJobForm';

export function ClientJobEditPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { values, setValues, skillsInput, setSkillsInput, errors, validate, normalizedValues } = useJobForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    void (async () => {
      try {
        const job = await getJobById(user.id, id);
        setValues({
          title: job.title,
          description: job.description,
          budgetMin: job.budgetMin,
          budgetMax: job.budgetMax,
          category: job.category ?? '',
          skills: job.skills,
          experienceLevel: job.experienceLevel,
          status: job.status,
        });
        setSkillsInput(job.skills.join(', '));
      } catch {
        setFormError('Unable to load job for editing.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, user?.id]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user || !validate() || isSaving) {
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await updateJob(user.id, id, normalizedValues);
      navigate(`/client/jobs/${id}`);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to update job.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="container">Loading job...</div>;
  }

  return (
    <div className="container account-grid">
      <h1>Edit Job</h1>
      <form className="form-stack info-card" onSubmit={onSubmit} noValidate>
        <JobFormFields
          values={values}
          setValues={setValues}
          skillsInput={skillsInput}
          setSkillsInput={setSkillsInput}
          errors={errors}
        />

        <label>
          Status
          <select
            value={values.status}
            onChange={(e) => setValues((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))}
          >
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </label>

        {formError ? <p className="field-error">{formError}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
