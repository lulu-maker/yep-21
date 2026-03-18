import { useState } from 'react';
import { subscribeToNewsletter } from '../../api/newsletterApi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function useNewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onChangeEmail = (value: string) => {
    setEmail(value);
    if (error) {
      setError(null);
    }
    if (isSuccess) {
      setIsSuccess(false);
    }
  };

  const onSubmit = async () => {
    const normalized = normalizeEmail(email);

    if (!normalized) {
      setError('Email is required.');
      return;
    }

    if (!EMAIL_REGEX.test(normalized)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await subscribeToNewsletter({ email: normalized });
      setIsSuccess(true);
      setEmail('');
    } catch {
      setError('Unable to subscribe at the moment. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    error,
    isSubmitting,
    isSuccess,
    onChangeEmail,
    onSubmit,
  };
}
