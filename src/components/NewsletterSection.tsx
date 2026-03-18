import { useNewsletterForm } from '../features/newsletter/useNewsletterForm';

export function NewsletterSection() {
  const { email, error, isSubmitting, isSuccess, onChangeEmail, onSubmit } = useNewsletterForm();

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div className="container newsletter-inner">
        <div>
          <h2 id="newsletter-heading">Get freelance growth insights weekly</h2>
          <p>
            Product tips, hiring playbooks, and platform updates for both clients and freelancers.
          </p>
        </div>

        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit();
          }}
          noValidate
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => onChangeEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'newsletter-error' : undefined}
          />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error ? (
            <p id="newsletter-error" className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          {isSuccess ? (
            <p className="form-success" role="status">
              Subscribed successfully.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
