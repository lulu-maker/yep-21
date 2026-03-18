import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClientProfile, updateClientProfile } from '../../api/clientApi';
import { useAuth } from '../../contexts/AuthContext';
import type { ClientProfile } from '../../types/client';

function validate(values: ClientProfile) {
  const errors: Partial<Record<keyof ClientProfile, string>> = {};

  if (values.fullName.trim().length < 2 || values.fullName.trim().length > 80) {
    errors.fullName = 'Full name must be between 2 and 80 characters.';
  }

  if (values.companyName.length > 120) {
    errors.companyName = 'Company name cannot exceed 120 characters.';
  }

  if (!values.country.trim()) {
    errors.country = 'Country is required.';
  }

  const descriptionLength = values.description.trim().length;
  if (descriptionLength < 20 || descriptionLength > 1000) {
    errors.description = 'Description must be between 20 and 1000 characters.';
  }

  return errors;
}

export function ClientOnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [values, setValues] = useState<ClientProfile>({
    fullName: user?.fullName ?? '',
    companyName: '',
    country: '',
    description: '',
    avatarUrl: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientProfile, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const profile = await getClientProfile();
      setValues((prev) => ({ ...prev, ...profile, fullName: prev.fullName || profile.fullName }));
    })();
  }, []);

  const completion = useMemo(() => {
    const checks = [values.fullName.trim(), values.country.trim(), values.description.trim()];
    const score = checks.filter(Boolean).length;
    return Math.round((score / checks.length) * 100);
  }, [values]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || isLoading) {
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      await updateClientProfile({
        ...values,
        fullName: values.fullName.trim(),
        companyName: values.companyName.trim(),
        country: values.country.trim(),
        description: values.description.trim(),
        avatarUrl: values.avatarUrl.trim(),
      });

      if (user) {
        updateUser({ ...user, fullName: values.fullName.trim(), onboardingCompleted: true });
      }

      navigate('/client/account');
    } catch {
      setFormError('Could not save onboarding data. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container account-grid">
      <section>
        <p className="eyebrow">Client onboarding</p>
        <h1>Set up your client profile</h1>
        <p className="lead">Profile completion: {completion}%</p>
      </section>

      <form className="form-stack info-card" onSubmit={onSubmit} noValidate>
        <label>
          Full name
          <input
            value={values.fullName}
            onChange={(e) => setValues((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          {errors.fullName ? <span className="field-error">{errors.fullName}</span> : null}
        </label>
        <label>
          Company name (optional)
          <input
            value={values.companyName}
            onChange={(e) => setValues((prev) => ({ ...prev, companyName: e.target.value }))}
          />
          {errors.companyName ? <span className="field-error">{errors.companyName}</span> : null}
        </label>
        <label>
          Country
          <input
            value={values.country}
            onChange={(e) => setValues((prev) => ({ ...prev, country: e.target.value }))}
          />
          {errors.country ? <span className="field-error">{errors.country}</span> : null}
        </label>
        <label>
          Avatar URL (optional)
          <input
            value={values.avatarUrl}
            onChange={(e) => setValues((prev) => ({ ...prev, avatarUrl: e.target.value }))}
          />
        </label>
        <label>
          Description
          <textarea
            value={values.description}
            onChange={(e) => setValues((prev) => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
          {errors.description ? <span className="field-error">{errors.description}</span> : null}
        </label>
        {formError ? <p className="field-error">{formError}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Complete setup'}
        </button>
      </form>
    </div>
  );
}
