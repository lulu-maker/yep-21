import { useState, type FormEvent } from 'react';
import { forgotPassword } from '../../api/authApi';
import { EMAIL_REGEX, normalizeEmail } from '../../utils/validation';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const normalized = normalizeEmail(email);

    if (!EMAIL_REGEX.test(normalized)) {
      setError('Enter a valid email.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword({ email: normalized });
      setSuccess(true);
    } catch {
      setError('Unable to submit right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Forgot password</h1>
      <form className="form-stack" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        {success ? <p className="field-success">Reset instructions sent.</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send reset email'}
        </button>
      </form>
    </>
  );
}
