import { useEffect, useMemo, useState } from 'react';
import { getFreelancerProfile, updateFreelancerProfile } from '../../api/freelancerApi';
import { parseResumeWithOcr } from '../../api/ocrApi';
import type { FreelancerProfile } from '../../types/freelancer';

function completion(profile: FreelancerProfile) {
  const checks = [
    profile.fullName.trim(),
    profile.title.trim(),
    profile.bio.trim(),
    profile.skills.length ? 'yes' : '',
    profile.hourlyRate > 0 ? 'yes' : '',
    profile.country.trim(),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function FreelancerAccountPage() {
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const data = await getFreelancerProfile();
      setProfile(data);
      setSkillsInput(data.skills.join(', '));
    })();
  }, []);

  const profileCompletion = useMemo(() => (profile ? completion(profile) : 0), [profile]);

  const save = async () => {
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const next = {
        ...profile,
        skills: skillsInput
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      await updateFreelancerProfile(next);
      setProfile(next);
      setMessage('Freelancer profile saved.');
    } catch {
      setMessage('Unable to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const onResumeUpload = async (file: File | null) => {
    if (!profile || !file) return;
    setIsParsingResume(true);
    setMessage(null);
    try {
      const parsed = await parseResumeWithOcr(file);
      const shouldFill = window.confirm('Apply extracted resume data to your profile fields?');
      if (!shouldFill) {
        return;
      }
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              fullName: parsed.name || prev.fullName,
              bio: parsed.experience || prev.bio,
              skills: prev.skills.length ? prev.skills : parsed.skills,
            }
          : prev,
      );
      setSkillsInput((prev) => (prev.trim() ? prev : parsed.skills.join(', ')));
      setMessage('Resume parsed. Review fields before saving.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to parse resume file.');
    } finally {
      setIsParsingResume(false);
    }
  };

  if (!profile) {
    return <div className="container">Loading freelancer account...</div>;
  }

  return (
    <div className="container account-grid">
      <section className="card-grid">
        <article className="info-card">
          <h2>Public profile</h2>
          <p>{profile.title || 'Add your title'}</p>
          <p>{profile.country || 'Country missing'}</p>
        </article>
        <article className="info-card">
          <h2>Skills</h2>
          <p>{profile.skills.length ? profile.skills.join(', ') : 'Add your first skill'}</p>
        </article>
        <article className="info-card">
          <h2>Hourly rate</h2>
          <p>${profile.hourlyRate || 0}/hr</p>
        </article>
        <article className="info-card">
          <h2>Profile completion</h2>
          <p>{profileCompletion}%</p>
        </article>
      </section>

      <section className="info-card form-stack">
        <h2>Edit freelancer profile</h2>
        <label>
          Resume (PDF/DOC/DOCX)
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => void onResumeUpload(e.target.files?.[0] ?? null)} disabled={isParsingResume} />
        </label>
        {isParsingResume ? <p className="meta">Running OCR extraction...</p> : null}
        <label>
          Full name
          <input value={profile.fullName} onChange={(e) => setProfile((prev) => (prev ? { ...prev, fullName: e.target.value } : prev))} />
        </label>
        <label>
          Professional title
          <input value={profile.title} onChange={(e) => setProfile((prev) => (prev ? { ...prev, title: e.target.value } : prev))} />
        </label>
        <label>
          Bio
          <textarea rows={4} value={profile.bio} onChange={(e) => setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : prev))} />
        </label>
        <label>
          Skills
          <input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
        </label>
        <label>
          Hourly rate
          <input
            type="number"
            min={1}
            value={profile.hourlyRate}
            onChange={(e) => setProfile((prev) => (prev ? { ...prev, hourlyRate: Number(e.target.value) } : prev))}
          />
        </label>
        <label>
          Country
          <input value={profile.country} onChange={(e) => setProfile((prev) => (prev ? { ...prev, country: e.target.value } : prev))} />
        </label>
        <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save freelancer profile'}
        </button>
        {message ? <p className="field-success">{message}</p> : null}
      </section>
    </div>
  );
}
