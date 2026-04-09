import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function TaskForm({ onClose }) {
  const { addTask } = useApp();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium',
    requestedCompletionDate: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;
    addTask(form);
    onClose();
  };

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Submit a Task Request</h2>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        </div>
        <p style={styles.subtitle}>
          Describe what you need from the IT team. We'll review it and keep you updated on progress.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Task Title <span style={styles.required}>*</span></label>
            <input
              style={styles.input}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief title of what you need"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Description <span style={styles.required}>*</span></label>
            <textarea
              style={{ ...styles.input, ...styles.textarea }}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Please describe the issue or request in detail. Include any relevant context, deadlines, or affected systems."
              required
              rows={5}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Category</label>
              <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
                <option>General</option>
                <option>Infrastructure</option>
                <option>Software</option>
                <option>Security</option>
                <option>Training</option>
                <option>Website</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select style={styles.input} name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Requested Completion Date</label>
            <input
              style={styles.input}
              type="date"
              name="requestedCompletionDate"
              value={form.requestedCompletionDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(10, 30, 15, 0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 200,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    background: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px 24px 0',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a2e1f',
  },
  closeBtn: {
    background: '#f0faf4',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: '8px',
    fontSize: '16px',
    color: '#5a8a6a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    padding: '8px 24px 0',
    fontSize: '13px',
    color: '#6b8f74',
    lineHeight: 1.5,
  },
  form: {
    padding: '20px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  row: {
    display: 'flex',
    gap: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2a4a32',
  },
  required: {
    color: '#c0392b',
  },
  input: {
    padding: '10px 13px',
    border: '1.5px solid #c8e6d0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a2e1f',
    outline: 'none',
    background: '#fafffe',
    width: '100%',
  },
  textarea: {
    resize: 'vertical',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '4px',
  },
  cancelBtn: {
    padding: '10px 20px',
    background: '#f0faf4',
    color: '#3d7a50',
    border: '1.5px solid #c8e6d0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
  },
};
