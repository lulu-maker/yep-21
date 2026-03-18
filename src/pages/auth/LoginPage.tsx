import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { routeForAuthenticatedUser } from '../../utils/authRouting';
import { EMAIL_REGEX, normalizeEmail } from '../../utils/validation';

export function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeEmail(email);

    if (!EMAIL_REGEX.test(normalized) || !password) {
      setError('Enter a valid email and password.');
      return;
    }

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await loginUser({ email: normalized, password });
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || routeForAuthenticatedUser(user.role, user.onboardingCompleted));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <p className="eyebrow">Welcome back</p>
      <h1>Account login</h1>
      <form className="form-stack" onSubmit={onSubmit} noValidate>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
    </>
  );
}
