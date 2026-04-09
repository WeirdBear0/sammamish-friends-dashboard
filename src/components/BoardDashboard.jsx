import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';

const LeafDecor = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" width="80" height="80">
    <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
    <path d="M10 90 C30 75 50 60 70 30" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
  </svg>
);

const STATUS_CONFIG = {
  pending:       { label: 'Pending',     color: '#f57f17', bg: '#fff8e1' },
  'in-progress': { label: 'In Progress', color: '#1565c0', bg: '#e3f2fd' },
  completed:     { label: 'Completed',   color: '#2e7d32', bg: '#e8f5e9' },
};

export default function BoardDashboard() {
  const { tasks, tasksLoading, currentUser } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');

  const myTasks = tasks.filter((t) => t.submittedBy === currentUser.username);

  const pending = myTasks.filter((t) => t.status === 'pending').length;
  const inProgress = myTasks.filter((t) => t.status === 'in-progress').length;
  const completed = myTasks.filter((t) => t.status === 'completed').length;

  const filtered = myTasks
    .filter((t) => {
      if (filter === 'Pending') return t.status === 'pending';
      if (filter === 'In Progress') return t.status === 'in-progress';
      if (filter === 'Completed') return t.status === 'completed';
      return true;
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return (
    <div style={styles.page} className="dash-page">
      {/* Welcome Banner */}
      <div style={styles.banner} className="dash-banner">
        <div style={styles.bannerLeaf}>
          <LeafDecor />
        </div>
        <div style={styles.bannerContent}>
          <h1 style={styles.bannerTitle} className="dash-banner-title">Welcome, {currentUser.name}</h1>
          <p style={styles.bannerText} className="dash-banner-text">
            Use this portal to submit IT requests and track their progress. The IT team will review your requests and keep you updated.
          </p>
          <button onClick={() => setShowForm(true)} style={styles.newRequestBtn}>
            + Submit New Task Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: 'Submitted', value: myTasks.length, bg: '#f0faf4', color: '#1a5c3a' },
          { label: 'Pending Review', value: pending, bg: '#fff8e1', color: '#f57f17' },
          { label: 'In Progress', value: inProgress, bg: '#e3f2fd', color: '#1565c0' },
          { label: 'Completed', value: completed, bg: '#e8f5e9', color: '#2e7d32' },
        ].map((s) => (
          <div key={s.label} style={{ ...styles.statCard, background: s.bg }}>
            <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Task List */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>My Submitted Requests</h2>
          <div style={styles.filters}>
            {['All', 'Pending', 'In Progress', 'Completed'].map((f) => (
              <button
                key={f}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {tasksLoading ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Loading tasks…</p>
          </div>
        ) : myTasks.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIllustration}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="#c8e6d0" width="64" height="64">
                <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
              </svg>
            </div>
            <p style={styles.emptyTitle}>No requests yet</p>
            <p style={styles.emptyText}>Submit your first IT task request to get started.</p>
            <button onClick={() => setShowForm(true)} style={styles.emptyBtn}>
              Submit a Request
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>No tasks match this filter.</p>
          </div>
        ) : (
          <div style={styles.taskList}>
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div style={styles.howItWorks}>
        <h3 style={styles.howTitle}>How It Works</h3>
        <div style={styles.stepsRow}>
          {[
            { step: '1', title: 'Submit a Request', text: 'Describe your IT need with as much detail as possible.' },
            { step: '2', title: 'IT Team Reviews', text: 'The IT team picks up your request and starts working on it.' },
            { step: '3', title: 'Progress Updates', text: 'You\'ll see progress notes posted here as work continues.' },
            { step: '4', title: 'Marked Complete', text: 'Once resolved, the task is marked completed with a final note.' },
          ].map((s) => (
            <div key={s.step} style={styles.step}>
              <div style={styles.stepNum}>{s.step}</div>
              <div style={styles.stepTitle}>{s.title}</div>
              <div style={styles.stepText}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>

      {showForm && <TaskForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '28px 24px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  banner: {
    background: 'linear-gradient(135deg, #1a5c3a 0%, #2d8a58 100%)',
    borderRadius: '18px',
    padding: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  bannerLeaf: {
    color: 'rgba(255,255,255,0.12)',
    flexShrink: 0,
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: 'translateY(-50%) rotate(-20deg)',
    pointerEvents: 'none',
  },
  bannerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    position: 'relative',
  },
  bannerTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
  },
  bannerText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
    maxWidth: '500px',
  },
  newRequestBtn: {
    alignSelf: 'flex-start',
    marginTop: '6px',
    padding: '12px 22px',
    background: '#fff',
    color: '#1a5c3a',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px',
  },
  statCard: {
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '12px',
    color: '#5a8a6a',
    fontWeight: '500',
  },
  section: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e8f5e9',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '18px 20px',
    borderBottom: '1px solid #e8f5e9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a2e1f',
  },
  filters: {
    display: 'flex',
    gap: '4px',
    background: '#f0faf4',
    borderRadius: '8px',
    padding: '3px',
  },
  filterBtn: {
    padding: '6px 13px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#5a8a6a',
    background: 'transparent',
    cursor: 'pointer',
  },
  filterBtnActive: {
    background: '#fff',
    color: '#1a5c3a',
    fontWeight: '700',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '56px 24px',
    color: '#9ab9a0',
  },
  emptyIllustration: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#5a8a6a',
    marginBottom: '6px',
  },
  emptyText: {
    fontSize: '13px',
    marginBottom: '20px',
  },
  emptyBtn: {
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  howItWorks: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e8f5e9',
    padding: '24px',
  },
  howTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a2e1f',
    marginBottom: '18px',
  },
  stepsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  stepNum: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  stepTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a2e1f',
  },
  stepText: {
    fontSize: '12px',
    color: '#6b8f74',
    lineHeight: 1.5,
  },
};
