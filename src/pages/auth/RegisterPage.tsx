import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { EMAIL_REGEX, normalizeEmail } from '../../utils/validation';
import type { UserRole } from '../../types/auth';

interface FormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function nextRoute(role: UserRole) {
  return role === 'freelancer' ? '/freelancer/onboarding' : '/client/onboarding';
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { registerUser } = useAuth();
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const initialRole = searchParams.get('role') === 'client' ? 'client' : 'freelancer';
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormValues, string>> = {};
    const email = normalizeEmail(values.email);

    if (values.fullName.trim().length < 2 || values.fullName.trim().length > 80) {
      nextErrors.fullName = 'Full name must be between 2 and 80 characters.';
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (values.password.length < 8 || values.password.length > 128) {
      nextErrors.password = 'Password must be between 8 and 128 characters.';
    }
    if (!values.confirmPassword || values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords must match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate() || isSubmitting) {
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      const user = await registerUser({
        fullName: values.fullName.trim(),
        email: normalizeEmail(values.email),
        password: values.password,
        role: selectedRole,
      });
      navigate(nextRoute(user.role));
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <p className="eyebrow">Registration</p>
      <h1>Create your {selectedRole} account</h1>
      <form onSubmit={onSubmit} className="form-stack" noValidate>
        <label>
          Account type
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as UserRole)}>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </label>

        <label>
          Full name
          <input
            value={values.fullName}
            onChange={(e) => setValues((prev) => ({ ...prev, fullName: e.target.value }))}
          />
          {errors.fullName ? <span className="field-error">{errors.fullName}</span> : null}
        </label>
        <label>
          Email
          <input
            type="email"
            value={values.email}
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
          />
          {errors.email ? <span className="field-error">{errors.email}</span> : null}
        </label>
        <label>
          Password
          <input
            type="password"
            value={values.password}
            onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
          />
          {errors.password ? <span className="field-error">{errors.password}</span> : null}
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(e) => setValues((prev) => ({ ...prev, confirmPassword: e.target.value }))}
          />
          {errors.confirmPassword ? <span className="field-error">{errors.confirmPassword}</span> : null}
        </label>
        {formError ? <p className="field-error">{formError}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : `Register as ${selectedRole}`}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </>
  );
}
