import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProgressModal from './ProgressModal';

const PRIORITY_CONFIG = {
  low:    { label: 'Low',    bg: '#e8f5e9', text: '#2e7d32', dot: '#4caf50' },
  medium: { label: 'Medium', bg: '#fff8e1', text: '#f57f17', dot: '#ffc107' },
  high:   { label: 'High',   bg: '#fce4ec', text: '#c62828', dot: '#ef5350' },
  urgent: { label: 'Urgent', bg: '#fce4ec', text: '#b71c1c', dot: '#f44336' },
};

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     bg: '#fff8e1', text: '#f57f17', border: '#ffe082' },
  'in-progress': { label: 'In Progress', bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' },
  completed:   { label: 'Completed',   bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskCard({ task }) {
  const { currentUser, completeTask, deleteTask } = useApp();
  const [showProgress, setShowProgress] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isIT = currentUser?.role === 'it';
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;

  return (
    <>
      <div style={styles.card}>
        {/* Top strip color by priority */}
        <div style={{ ...styles.priorityStrip, background: priority.dot }} />

        <div style={styles.body}>
          <div style={styles.topRow} className="task-top-row">
            <div style={styles.titleGroup}>
              <h3 style={styles.taskTitle}>{task.title}</h3>
              <div style={styles.badges}>
                <span style={{ ...styles.badge, background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>
                  {status.label}
                </span>
                <span style={{ ...styles.badge, background: priority.bg, color: priority.text }}>
                  <span style={{ ...styles.dot, background: priority.dot }} />
                  {priority.label}
                </span>
                <span style={styles.categoryBadge}>{task.category}</span>
              </div>
            </div>

            <div style={styles.actions} className="task-actions">
              {isIT && task.status !== 'completed' && (
                <>
                  <button
                    onClick={() => setShowProgress(true)}
                    style={styles.actionBtn}
                    title="Add progress note"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => completeTask(task.id)}
                    style={{ ...styles.actionBtn, ...styles.completeActionBtn }}
                    title="Mark as completed"
                  >
                    Complete
                  </button>
                </>
              )}
              {isIT && task.status === 'completed' && (
                <button
                  onClick={() => setShowProgress(true)}
                  style={styles.viewBtn}
                >
                  View
                </button>
              )}
              {!isIT && (
                <button
                  onClick={() => setShowProgress(true)}
                  style={styles.viewBtn}
                >
                  Details
                </button>
              )}
            </div>
          </div>

          <p style={styles.description}>
            {expanded || task.description.length <= 120
              ? task.description
              : task.description.slice(0, 120) + '…'}
            {task.description.length > 120 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={styles.toggleBtn}
              >
                {expanded ? ' less' : ' more'}
              </button>
            )}
          </p>

          <div style={styles.footer}>
            <div style={styles.footerLeft}>
              <span style={styles.footerText}>
                Submitted by <strong>{task.submittedByName}</strong> · {formatDate(task.submittedAt)}
              </span>
              {task.requestedCompletionDate && (
                <span style={styles.footerText}>
                  · Requested by{' '}
                  <strong>
                    {new Date(task.requestedCompletionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </strong>
                </span>
              )}
              {task.completedAt && (
                <span style={styles.completedText}>
                  · Completed {formatDate(task.completedAt)}
                </span>
              )}
            </div>

            <div style={styles.footerRight}>
              {task.progressNotes.length > 0 && (
                <span style={styles.notesCount}>
                  {task.progressNotes.length} {task.progressNotes.length === 1 ? 'update' : 'updates'}
                </span>
              )}
              {isIT && (
                <button
                  onClick={() => deleteTask(task.id)}
                  style={styles.deleteBtn}
                  title="Delete task"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showProgress && (
        <ProgressModal task={task} onClose={() => setShowProgress(false)} />
      )}
    </>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
    display: 'flex',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
    border: '1px solid #e8f5e9',
  },
  priorityStrip: {
    width: '4px',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    padding: '16px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: 0,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  titleGroup: {
    flex: 1,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a2e1f',
    lineHeight: 1.3,
    marginBottom: '7px',
  },
  badges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    display: 'inline-block',
  },
  categoryBadge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '500',
    background: '#f0faf4',
    color: '#3d7a50',
    border: '1px solid #c8e6d0',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  actionBtn: {
    padding: '7px 14px',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  completeActionBtn: {
    background: 'linear-gradient(135deg, #2e7d32, #43a047)',
  },
  viewBtn: {
    padding: '7px 14px',
    background: '#f0faf4',
    color: '#1a5c3a',
    border: '1.5px solid #c8e6d0',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '13px',
    color: '#3d5a47',
    lineHeight: 1.6,
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#1a5c3a',
    fontSize: '13px',
    fontWeight: '600',
    padding: 0,
    textDecoration: 'underline',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '8px',
    borderTop: '1px solid #f0faf4',
    flexWrap: 'wrap',
  },
  footerLeft: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: '12px',
    color: '#7aaa85',
  },
  completedText: {
    fontSize: '12px',
    color: '#2e7d32',
    fontWeight: '500',
  },
  footerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  notesCount: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#3d7a50',
    background: '#e8f5e9',
    padding: '2px 9px',
    borderRadius: '20px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#bbb',
    fontSize: '11px',
    fontWeight: '500',
    padding: '2px 6px',
    borderRadius: '4px',
    textDecoration: 'underline',
  },
};
