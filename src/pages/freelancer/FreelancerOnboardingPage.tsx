import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFreelancerProfile, updateFreelancerProfile } from '../../api/freelancerApi';
import { useAuth } from '../../contexts/AuthContext';
import type { FreelancerProfile } from '../../types/freelancer';
import { COUNTRY_OPTIONS, PHONE_CODE_OPTIONS } from '../../constants/location';

function validate(values: FreelancerProfile) {
  const errors: Partial<Record<keyof FreelancerProfile, string>> = {};

  if (values.fullName.trim().length < 2 || values.fullName.trim().length > 80) {
    errors.fullName = 'Full name must be between 2 and 80 characters.';
  }
  if (values.title.trim().length < 3 || values.title.trim().length > 120) {
    errors.title = 'Title must be between 3 and 120 characters.';
  }
  if (values.bio.trim().length < 50 || values.bio.trim().length > 2000) {
    errors.bio = 'Bio must be between 50 and 2000 characters.';
  }
  if (!values.skills.length || values.skills.length > 15) {
    errors.skills = 'Add between 1 and 15 skills.';
  }
  if (values.hourlyRate < 1) {
    errors.hourlyRate = 'Hourly rate must be at least 1.';
  }
  if (!values.country.trim()) {
    errors.country = 'Country is required.';
  }

  return errors;
}

export function FreelancerOnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [values, setValues] = useState<FreelancerProfile>({
    fullName: user?.fullName ?? '',
    title: '',
    bio: '',
    skills: [],
    hourlyRate: 1,
    country: '',
    phoneCode: '+1',
    phoneNumber: '',
    avatarUrl: '',
    availability: 'open_for_work',
    activityStatus: 'active',
    verificationStatus: 'unverified',
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FreelancerProfile, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const profile = await getFreelancerProfile();
      setValues((prev) => ({ ...prev, ...profile, fullName: prev.fullName || profile.fullName }));
      setSkillsInput(profile.skills.join(', '));
    })();
  }, []);

  const completion = useMemo(() => {
    const checks = [
      values.fullName.trim(),
      values.title.trim(),
      values.bio.trim(),
      String(values.hourlyRate),
      values.country.trim(),
      values.skills.length ? 'yes' : '',
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [values]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedSkills = skillsInput
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = { ...values, skills: normalizedSkills };
    const nextErrors = validate(payload);

    setValues(payload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || isSaving) {
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      await updateFreelancerProfile(payload);
      if (user) {
        updateUser({ ...user, fullName: payload.fullName, onboardingCompleted: true });
      }
      navigate('/freelancer/account');
    } catch {
      setFormError('Unable to save freelancer profile. Please retry.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container account-grid">
      <section>
        <p className="eyebrow">Freelancer onboarding</p>
        <h1>Build your professional profile</h1>
        <p className="lead">Profile completion: {completion}%</p>
      </section>

      <form className="form-stack info-card" onSubmit={onSubmit} noValidate>
        <label>
          Full name
          <input value={values.fullName} onChange={(e) => setValues((prev) => ({ ...prev, fullName: e.target.value }))} />
          {errors.fullName ? <span className="field-error">{errors.fullName}</span> : null}
        </label>

        <label>
          Professional title
          <input value={values.title} onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))} />
          {errors.title ? <span className="field-error">{errors.title}</span> : null}
        </label>

        <label>
          Bio
          <textarea rows={5} value={values.bio} onChange={(e) => setValues((prev) => ({ ...prev, bio: e.target.value }))} />
          {errors.bio ? <span className="field-error">{errors.bio}</span> : null}
        </label>

        <label>
          Skills (comma separated)
          <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
          {errors.skills ? <span className="field-error">{errors.skills}</span> : null}
        </label>

        <label>
          Hourly rate (USD)
          <input
            type="number"
            min={1}
            value={values.hourlyRate}
            onChange={(e) => setValues((prev) => ({ ...prev, hourlyRate: Number(e.target.value) }))}
          />
          {errors.hourlyRate ? <span className="field-error">{errors.hourlyRate}</span> : null}
        </label>

        <label>
          Country
          <select value={values.country} onChange={(e) => setValues((prev) => ({ ...prev, country: e.target.value }))}>
            <option value="">Select country</option>
            {COUNTRY_OPTIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          {errors.country ? <span className="field-error">{errors.country}</span> : null}
        </label>

        <label>
          Phone (optional)
          <div className="phone-input-row">
            <select value={values.phoneCode ?? '+1'} onChange={(e) => setValues((prev) => ({ ...prev, phoneCode: e.target.value }))}>
              {PHONE_CODE_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input
              type="tel"
              inputMode="tel"
              placeholder="555 123 4567"
              value={values.phoneNumber ?? ''}
              onChange={(e) => setValues((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>
        </label>

        <label>
          Avatar URL (optional)
          <input value={values.avatarUrl} onChange={(e) => setValues((prev) => ({ ...prev, avatarUrl: e.target.value }))} />
        </label>

        <label>
          Availability
          <select
            value={values.availability}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, availability: e.target.value as FreelancerProfile['availability'] }))
            }
          >
            <option value="open_for_work">Open to work</option>
            <option value="partly_available">Partly available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </label>

        {formError ? <p className="field-error">{formError}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Complete freelancer setup'}
        </button>
      </form>
    </div>
  );
}
