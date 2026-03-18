import { Link } from 'react-router-dom';

export function ClientProjectCreatePage() {
  return (
    <div className="container form-page">
      <div className="profile-page-head">
        <h2>Add Project</h2>
        <div className="job-actions">
          <Link to="/client/projects" className="btn btn-ghost">Cancel</Link>
          <button type="button" className="btn btn-primary">Add project</button>
        </div>
      </div>

      <section className="info-card form-stack">
        <h3>Basic info</h3>
        <div className="two-col-grid">
          <label>Project title<input /></label>
          <label>Project type<input /></label>
        </div>
        <h3>Time</h3>
        <div className="two-col-grid">
          <label>Start date<input type="date" /></label>
          <label>End date<input type="date" /></label>
        </div>
        <h3>Project description</h3>
        <label>Description<textarea rows={5} /></label>
        <h3>Attachments</h3>
        <div className="upload-box">Drop files or click to upload</div>
        <h3>Tags</h3>
        <label>Tags<input placeholder="React, TypeScript, API" /></label>
      </section>
    </div>
  );
}
