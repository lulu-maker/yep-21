import { useEffect, useState } from 'react';
import { getVerificationStatus, submitVerification } from '../../api/verificationApi';
import type { VerificationRecord } from '../../types/verification';

export function VerificationPanel({ userId }: { userId: string }) {
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [docs, setDocs] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const data = await getVerificationStatus(userId);
    setRecord(data);
  };

  useEffect(() => {
    void load();
  }, [userId]);

  const onSubmit = async () => {
    if (!docs || docs.length === 0) {
      setMessage('Please upload at least one document.');
      return;
    }
    setIsSubmitting(true);
    setMessage(null);
    try {
      await submitVerification(
        userId,
        Array.from(docs).map((file) => ({ name: file.name, type: file.type || 'document' })),
      );
      setMessage('Verification submitted successfully.');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to submit verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="info-card form-stack">
      <h3>Verification</h3>
      <p className="meta">Status: {record?.verificationStatus ?? 'unverified'}</p>
      {record?.submittedAt ? <p className="meta">Submitted: {new Date(record.submittedAt).toLocaleDateString()}</p> : null}
      <label>
        Upload verification documents
        <input type="file" multiple onChange={(e) => setDocs(e.target.files)} />
      </label>
      {record?.documents.length ? (
        <ul>
          {record.documents.map((doc) => (
            <li key={doc.id}>{doc.name}</li>
          ))}
        </ul>
      ) : (
        <p className="meta">No documents submitted yet.</p>
      )}
      <button type="button" className="btn btn-primary" onClick={() => void onSubmit()} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit verification'}
      </button>
      {message ? <p className="field-success">{message}</p> : null}
    </section>
  );
}
