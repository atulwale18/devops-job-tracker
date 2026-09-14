import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = "/api";

const initialForm = {
  company: "",
  position: "",
  location: "",
  status: "Applied",
  applied_date: "",
  job_url: "",
  notes: ""
};

function App() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load job applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.company || !form.position) {
      setMessage("Company and position are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/jobs/${editingId}`, form);
        setMessage("Job application updated successfully.");
      } else {
        await axios.post(`${API_URL}/jobs`, form);
        setMessage("Job application added successfully.");
      }

      setForm(initialForm);
      setEditingId(null);
      await fetchJobs();
    } catch (error) {
      console.error(error);
      setMessage("Operation failed. Please try again.");
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);

    setForm({
      company: job.company || "",
      position: job.position || "",
      location: job.location || "",
      status: job.status || "Applied",
      applied_date: job.applied_date
        ? job.applied_date.substring(0, 10)
        : "",
      job_url: job.job_url || "",
      notes: job.notes || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/jobs/${id}`);
      setMessage("Job application deleted successfully.");
      await fetchJobs();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete application.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setMessage("");
  };

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      applied: jobs.filter((job) => job.status === "Applied").length,
      interview: jobs.filter((job) => job.status === "Interview").length,
      selected: jobs.filter((job) => job.status === "Selected").length,
      rejected: jobs.filter((job) => job.status === "Rejected").length
    };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text =
        `${job.company} ${job.position} ${job.location}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">DEVOPS PROJECT</p>
          <h1>Job Tracker</h1>
          <p className="subtitle">
            Track your job applications in one place.
          </p>
        </div>

        <div className="api-status">
          <span className="status-dot"></span>
          API Connected
        </div>
      </header>

      <main className="container">
        <section className="stats-grid">
          <div className="stat-card">
            <span>Total Applications</span>
            <strong>{stats.total}</strong>
          </div>

          <div className="stat-card">
            <span>Applied</span>
            <strong>{stats.applied}</strong>
          </div>

          <div className="stat-card">
            <span>Interviews</span>
            <strong>{stats.interview}</strong>
          </div>

          <div className="stat-card">
            <span>Selected</span>
            <strong>{stats.selected}</strong>
          </div>

          <div className="stat-card">
            <span>Rejected</span>
            <strong>{stats.rejected}</strong>
          </div>
        </section>

        {message && (
          <div className="message">
            {message}
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        <section className="form-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {editingId ? "EDIT APPLICATION" : "NEW APPLICATION"}
              </p>

              <h2>
                {editingId
                  ? "Update Job Application"
                  : "Add Job Application"}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="job-form">
            <div className="form-group">
              <label>Company *</label>
              <input
                type="text"
                name="company"
                placeholder="e.g. TCS"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Position *</label>
              <input
                type="text"
                name="position"
                placeholder="e.g. DevOps Engineer"
                value={form.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Pune"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="form-group">
              <label>Applied Date</label>
              <input
                type="date"
                name="applied_date"
                value={form.applied_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Job URL</label>
              <input
                type="url"
                name="job_url"
                placeholder="https://..."
                value={form.job_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                placeholder="Interview details, recruiter information, etc."
                value={form.notes}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? "Update Application" : "Add Application"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="jobs-section">
          <div className="section-heading jobs-heading">
            <div>
              <p className="eyebrow">APPLICATIONS</p>
              <h2>Your Job Applications</h2>
            </div>

            <div className="filters">
              <input
                type="text"
                placeholder="Search company, role..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              Loading applications...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              No job applications found.
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.company}</strong>
                      </td>

                      <td>{job.position}</td>

                      <td>{job.location || "-"}</td>

                      <td>
                        <span
                          className={`badge ${job.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td>
                        {job.applied_date
                          ? new Date(
                              job.applied_date
                            ).toLocaleDateString("en-IN")
                          : "-"}
                      </td>

                      <td>
                        <div className="actions">
                          {job.job_url && (
                            <a
                              href={job.job_url}
                              target="_blank"
                              rel="noreferrer"
                              className="action-link"
                            >
                              View
                            </a>
                          )}

                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(job)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(job.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          DevOps Job Tracker • Built with React, Node.js, MySQL & AWS
        </p>
      </footer>
    </div>
  );
}

export default App;
