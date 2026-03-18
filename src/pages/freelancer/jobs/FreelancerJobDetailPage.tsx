import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getMarketplaceJobById } from '../../../api/jobsApi';
import { createProposal, getFreelancerProposalByJob } from '../../../api/proposalsApi';
import { ProposalStatusBadge } from '../../../components/jobs/ProposalStatusBadge';
import { useAuth } from '../../../contexts/AuthContext';
import type { Job } from '../../../types/job';
import type { ProposalPayload, ProposalStatus } from '../../../types/proposal';

export function FreelancerJobDetailPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [existingProposalStatus, setExistingProposalStatus] = useState<ProposalStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [proposal, setProposal] = useState<ProposalPayload>({
    coverLetter: '',
    bidAmount: 100,
    deliveryDays: 7,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const item = await getMarketplaceJobById(id);
      setJob(item);

      if (user) {
        const proposalData = await getFreelancerProposalByJob(id, user.id);
        setExistingProposalStatus(proposalData?.status ?? null);
      }
    } catch {
      setError('Unable to load job details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id, user?.id]);

  const isApplyDisabled = useMemo(() => {
    if (!job) {
      return true;
    }

    if (existingProposalStatus) {
      return true;
    }

    return job.status !== 'open' || job.clientId === user?.id;
  }, [job, existingProposalStatus, user?.id]);

  const applyLabel =
    existingProposalStatus
      ? 'Applied'
      : job?.status === 'paused'
        ? 'Job paused'
        : job?.status === 'closed'
          ? 'Job closed'
          : 'Apply now';

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!user || !job || isApplyDisabled || isSubmitting) {
      return;
    }

    if (proposal.coverLetter.trim().length < 30) {
      setFormError('Cover letter must be at least 30 characters.');
      return;
    }

    if (proposal.bidAmount <= 0) {
      setFormError('Bid amount must be positive.');
      return;
    }

    if (proposal.deliveryDays < 1) {
      setFormError('Delivery days must be at least 1.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setSuccess(null);

    try {
      const created = await createProposal(job.id, user.id, proposal);
      setExistingProposalStatus(created.status);
      setSuccess('Proposal submitted successfully.');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="container">Loading job details...</div>;
  }

  if (error || !job) {
    return (
      <div className="container state-box">
        <p>{error ?? 'Job not found.'}</p>
        <button type="button" className="btn btn-secondary" onClick={() => void load()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container account-grid">
      <Link to="/freelancer/jobs" className="text-link">
        ← Back to jobs
      </Link>
      <article className="info-card">
        <p className="meta">{job.experienceLevel} · {job.status}</p>
        <h1>{job.title}</h1>
        {job.category ? <p className="meta">Category: {job.category}</p> : null}
        <p>{job.description}</p>
        <p>
          Budget: ${job.budgetMin} - ${job.budgetMax}
        </p>
        <p>Skills: {job.skills.join(', ')}</p>
      </article>

      <section className="info-card form-stack">
        <h2>Submit proposal</h2>
        {existingProposalStatus ? (
          <p>
            Proposal status: <ProposalStatusBadge status={existingProposalStatus} />
          </p>
        ) : null}
        {job.status === 'paused' ? <p className="field-error">This job is temporarily unavailable.</p> : null}

        <form className="form-stack" onSubmit={onSubmit} noValidate>
          <label>
            Cover letter
            <textarea
              rows={6}
              value={proposal.coverLetter}
              onChange={(e) => setProposal((prev) => ({ ...prev, coverLetter: e.target.value }))}
              disabled={isApplyDisabled}
            />
          </label>

          <div className="two-col-grid">
            <label>
              Bid amount
              <input
                type="number"
                min={1}
                value={proposal.bidAmount}
                onChange={(e) => setProposal((prev) => ({ ...prev, bidAmount: Number(e.target.value) }))}
                disabled={isApplyDisabled}
              />
            </label>
            <label>
              Delivery days
              <input
                type="number"
                min={1}
                value={proposal.deliveryDays}
                onChange={(e) => setProposal((prev) => ({ ...prev, deliveryDays: Number(e.target.value) }))}
                disabled={isApplyDisabled}
              />
            </label>
          </div>

          {formError ? <p className="field-error">{formError}</p> : null}
          {success ? <p className="field-success">{success}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={isApplyDisabled || isSubmitting}>
            {isSubmitting ? 'Submitting...' : applyLabel}
          </button>
        </form>
      </section>
    </div>
  );
}
