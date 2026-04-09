import { useEffect, useState } from 'react';
import { getJobs, addJob, deleteJob, updateJob } from '../services/jobService';

export default function Dashboard({ setToken }) {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    companyName: '',
    role: '',
    status: 'applied',
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editId, setEditId] = useState(null);

  //LOGOUT
  <button
    onClick={() => {
      localStorage.removeItem('token');
      setToken(null);
    }}
  >
    Logout
  </button>;

  // 🔄 Fetch jobs
  const fetchJobs = async () => {
    const data = await getJobs({
      search,
      status: statusFilter,
    });
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, [search, statusFilter]);

  // ➕ Add / Update job
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateJob(editId, form);
      setEditId(null);
    } else {
      await addJob(form);
    }

    setForm({
      companyName: '',
      role: '',
      status: 'applied',
    });

    fetchJobs();
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    await deleteJob(id);
    fetchJobs();
  };

  // ✏️ Edit
  const handleEdit = (job) => {
    setForm({
      companyName: job.companyName,
      role: job.role,
      status: job.status,
    });

    setEditId(job._id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Company"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />

        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
        </select>

        <button type="submit">{editId ? 'Update Job' : 'Add Job'}</button>
      </form>

      <hr />

      {/* FILTER */}
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="rejected">Rejected</option>
      </select>

      {/* JOB LIST */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} style={{ marginTop: '10px' }}>
            <h3>{job.companyName}</h3>
            <p>{job.role}</p>
            <p>{job.status}</p>

            <button onClick={() => handleEdit(job)}>Edit</button>
            <button onClick={() => handleDelete(job._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No jobs found</p>
      )}
    </div>
  );
}
