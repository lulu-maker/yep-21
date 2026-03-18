import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFreelancerProfile, updateFreelancerProfile } from '../../api/freelancerApi';
import { parseResumeWithOcr } from '../../api/ocrApi';
import type { FreelancerProfile } from '../../types/freelancer';

export function FreelancerProfileEditPage() {
  const navigate = useNavigate();
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

  const onResumeUpload = async (file: File | null) => {
    if (!profile || !file) return;
    setIsParsingResume(true);
    try {
      const parsed = await parseResumeWithOcr(file);
      setProfile({ ...profile, fullName: parsed.name || profile.fullName, bio: parsed.experience || profile.bio });
      setSkillsInput((prev) => (prev.trim() ? prev : parsed.skills.join(', ')));
    } finally {
      setIsParsingResume(false);
    }
  };

  const onSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    setMessage(null);
    try {
      await updateFreelancerProfile({
        ...profile,
        skills: skillsInput.split(',').map((item) => item.trim()).filter(Boolean),
      });
      navigate('/freelancer/account');
    } catch {
      setMessage('Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return <div className="container">Loading profile...</div>;

  return (
    <div className="container form-page">
      <div className="profile-page-head">
        <h2>Edit Profile Info</h2>
        <div className="job-actions">
          <Link to="/freelancer/account" className="btn btn-ghost">Cancel</Link>
          <button type="button" className="btn btn-primary" onClick={() => void onSave()} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>

      <section className="info-card form-stack">
        <div className="two-col-grid">
          <label>First name<input value={profile.fullName.split(' ')[0] ?? ''} onChange={(e) => setProfile((prev) => (prev ? { ...prev, fullName: `${e.target.value} ${prev.fullName.split(' ').slice(1).join(' ')}`.trim() } : prev))} /></label>
          <label>Last name<input value={profile.fullName.split(' ').slice(1).join(' ')} onChange={(e) => setProfile((prev) => (prev ? { ...prev, fullName: `${prev.fullName.split(' ')[0] ?? ''} ${e.target.value}`.trim() } : prev))} /></label>
        </div>
        <div className="two-col-grid">
          <label>Country<input value={profile.country} onChange={(e) => setProfile((prev) => (prev ? { ...prev, country: e.target.value } : prev))} /></label>
          <label>Email<input value="Visible in account" disabled /></label>
        </div>
        <label>Job category<input value={profile.title} onChange={(e) => setProfile((prev) => (prev ? { ...prev, title: e.target.value } : prev))} /></label>
        <label>Languages<input defaultValue="English" /></label>
        <label>About<textarea rows={4} value={profile.bio} onChange={(e) => setProfile((prev) => (prev ? { ...prev, bio: e.target.value } : prev))} /></label>
        <label>Experience<textarea rows={3} placeholder="List your work experience" /></label>
        <label>Attachments<div className="upload-box">Drop files or click to upload</div></label>
        <label>Skills<input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} /></label>
        <div className="two-col-grid">
          <label>Availability<select value={profile.availability} onChange={(e) => setProfile((prev) => (prev ? { ...prev, availability: e.target.value as typeof prev.availability } : prev))}><option value="open_for_work">Open for work</option><option value="partly_available">Partly available</option><option value="unavailable">Unavailable</option></select></label>
          <label>Verification status<select value={profile.verificationStatus} onChange={(e) => setProfile((prev) => (prev ? { ...prev, verificationStatus: e.target.value as typeof prev.verificationStatus } : prev))}><option value="unverified">Unverified</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option></select></label>
        </div>
        <label>Resume upload (OCR)
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => void onResumeUpload(e.target.files?.[0] ?? null)} disabled={isParsingResume} />
        </label>
        {isParsingResume ? <p className="meta">Processing resume with OCR...</p> : null}
        {message ? <p className="field-error">{message}</p> : null}
      </section>
    </div>
  );
}
