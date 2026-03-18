import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword({ token: params.get('token') ?? '', password });
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h1>Reset password</h1>
      <form className="form-stack" onSubmit={onSubmit}>
        <label>
          New password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Confirm new password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        {error ? <p className="field-error">{error}</p> : null}
        {success ? <p className="field-success">Password reset successfully.</p> : null}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Update password'}
        </button>
      </form>
    </>
  );
}
