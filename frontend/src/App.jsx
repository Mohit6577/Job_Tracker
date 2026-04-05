import { useState, useEffect } from 'react';
import { getJobs, addJob, deleteJob } from './services/jobService';

function App() {
  const [jobs, setJobs] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  const fetchJobs = async () => {
    const data = await getJobs({
      status: filterStatus,
      search: search,
    });
    // console.log('DATA', data);
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, [filterStatus, search]);

  const handleAddJob = async () => {
    if (!companyName || !role) {
      alert('Company and Role required');
      return;
    }
    await addJob({ companyName, role, status, notes });
    setCompanyName('');
    setRole('');
    setNotes('');
    fetchJobs();
  };

  const handleDeleteJob = async (id) => {
    await deleteJob(id);
    fetchJobs();
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>Job Tracker</h1>

      {/* FORM */}
      <input
        style={{ margin: '5px 0', padding: '8px', width: '100%' }}
        placeholder="Company"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <br />

      <input
        style={{ margin: '5px 0', padding: '8px', width: '100%' }}
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <br />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
      </select>
      <br />

      <input
        style={{ margin: '5px 0', padding: '8px', width: '100%' }}
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <br />

      <button
        style={{ marginTop: '10px', padding: '8px 12px' }}
        onClick={handleAddJob}
      >
        Add Job
      </button>

      <hr />
      <select onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="">All</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Rejected">Rejected</option>
      </select>
      <input
        style={{ margin: '5px 0', padding: '8px', width: '100%' }}
        placeholder="Search company or role..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* JOB LIST */}
      {jobs && jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id}>
            <h3>{job.companyName}</h3>
            <p>{job.role}</p>
            <p>{job.status}</p>
            <button
              style={{ marginTop: '10px', padding: '8px 12px' }}
              onClick={() => handleDeleteJob(job._id)}
            >
              Delete{' '}
            </button>
          </div>
        ))
      ) : (
        <p style={{ marginTop: '20px', color: 'gray' }}>No jobs found</p>
      )}
    </div>
  );
}

export default App;
