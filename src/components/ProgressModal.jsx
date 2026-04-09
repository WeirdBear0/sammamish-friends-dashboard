import { useState } from 'react';
import { useApp } from '../context/AppContext';

const PRIORITY_COLORS = {
  low: { bg: '#e8f5e9', text: '#2e7d32' },
  medium: { bg: '#fff8e1', text: '#f57f17' },
  high: { bg: '#fce4ec', text: '#c62828' },
  urgent: { bg: '#fce4ec', text: '#b71c1c' },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ProgressModal({ task, onClose }) {
  const { addProgressNote, completeTask } = useApp();
  const [noteText, setNoteText] = useState('');
  const [markComplete, setMarkComplete] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addProgressNote(task.id, noteText.trim());
    if (markComplete) {
      completeTask(task.id);
    }
    onClose();
  };

  const handleMarkCompleteOnly = () => {
    completeTask(task.id);
    onClose();
  };

  const priorityStyle = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>{task.title}</h2>
            <div style={styles.meta}>
              <span style={{ ...styles.badge, background: priorityStyle.bg, color: priorityStyle.text }}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
              <span style={styles.metaText}>Submitted by {task.submittedByName}</span>
              <span style={styles.metaText}>·</span>
              <span style={styles.metaText}>{formatDate(task.submittedAt)}</span>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close">✕</button>
        </div>

        <div style={styles.descBox}>
          <p style={styles.descLabel}>Request Description</p>
          <p style={styles.descText}>{task.description}</p>
        </div>

        {/* Progress Notes */}
        <div style={styles.notesSection}>
          <h3 style={styles.sectionTitle}>
            Progress Notes
            {task.progressNotes.length > 0 && (
              <span style={styles.noteCount}>{task.progressNotes.length}</span>
            )}
          </h3>
          {task.progressNotes.length === 0 ? (
            <p style={styles.emptyNotes}>No progress notes yet. Add the first update below.</p>
          ) : (
            <div style={styles.notesList}>
              {task.progressNotes.map((note) => (
                <div key={note.id} style={styles.noteItem}>
                  <div style={styles.noteHeader}>
                    <div style={styles.noteAvatar}>{note.author.charAt(0)}</div>
                    <div>
                      <span style={styles.noteAuthor}>{note.author}</span>
                      <span style={styles.noteDate}>{formatDate(note.date)}</span>
                    </div>
                  </div>
                  <p style={styles.noteText}>{note.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Note Form */}
        {task.status !== 'completed' && (
          <form onSubmit={handleSubmit} style={styles.addNoteForm}>
            <h3 style={styles.sectionTitle}>Add Progress Update</h3>
            <textarea
              style={styles.textarea}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Describe your progress, what was done, or next steps for this task..."
              rows={4}
              required
            />
            <div style={styles.checkRow}>
              <label style={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={markComplete}
                  onChange={(e) => setMarkComplete(e.target.checked)}
                  style={styles.checkbox}
                />
                Mark task as completed after posting this note
              </label>
            </div>
            <div style={styles.actions}>
              <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
              {task.status !== 'completed' && (
                <button
                  type="button"
                  onClick={handleMarkCompleteOnly}
                  style={styles.completeBtn}
                >
                  Mark Complete
                </button>
              )}
              <button type="submit" style={styles.submitBtn}>
                Post Update
              </button>
            </div>
          </form>
        )}

        {task.status === 'completed' && (
          <div style={styles.completedBanner}>
            <span style={styles.completedIcon}>✓</span>
            Task completed on {formatDate(task.completedAt)}
            <button onClick={onClose} style={styles.doneBtn}>Done</button>
          </div>
        )}
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
    maxWidth: '620px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 24px 16px',
    borderBottom: '1px solid #e8f5e9',
    gap: '16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a2e1f',
    lineHeight: 1.3,
    marginBottom: '8px',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
  badge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  metaText: {
    fontSize: '12px',
    color: '#7aaa85',
  },
  closeBtn: {
    background: '#f0faf4',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: '8px',
    fontSize: '14px',
    color: '#5a8a6a',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descBox: {
    padding: '16px 24px',
    background: '#f8fffe',
    borderBottom: '1px solid #e8f5e9',
  },
  descLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#7aaa85',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  descText: {
    fontSize: '14px',
    color: '#2a4a32',
    lineHeight: 1.6,
  },
  notesSection: {
    padding: '20px 24px',
    borderBottom: '1px solid #e8f5e9',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a2e1f',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  noteCount: {
    background: '#e8f5e9',
    color: '#2e7d32',
    fontSize: '11px',
    fontWeight: '700',
    padding: '1px 7px',
    borderRadius: '20px',
  },
  emptyNotes: {
    fontSize: '13px',
    color: '#9ab9a0',
    fontStyle: 'italic',
  },
  notesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  noteItem: {
    background: '#f8fffe',
    border: '1px solid #e0f0e5',
    borderRadius: '10px',
    padding: '14px',
  },
  noteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  noteAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },
  noteAuthor: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a2e1f',
    display: 'block',
    lineHeight: 1,
    marginBottom: '2px',
  },
  noteDate: {
    fontSize: '11px',
    color: '#9ab9a0',
    display: 'block',
  },
  noteText: {
    fontSize: '13px',
    color: '#2a4a32',
    lineHeight: 1.6,
  },
  addNoteForm: {
    padding: '20px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  textarea: {
    padding: '12px 14px',
    border: '1.5px solid #c8e6d0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a2e1f',
    outline: 'none',
    background: '#fafffe',
    resize: 'vertical',
    lineHeight: 1.5,
    fontFamily: 'inherit',
    width: '100%',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#3d5a47',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#1a5c3a',
    width: 16,
    height: 16,
  },
  actions: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '4px',
    flexWrap: 'wrap',
  },
  cancelBtn: {
    padding: '10px 18px',
    background: '#f0faf4',
    color: '#3d7a50',
    border: '1.5px solid #c8e6d0',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
  },
  completeBtn: {
    padding: '10px 18px',
    background: '#e8f5e9',
    color: '#2e7d32',
    border: '1.5px solid #a5d6a7',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
  },
  submitBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
  },
  completedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '16px 24px',
    background: '#e8f5e9',
    borderTop: '1px solid #c8e6c9',
    fontSize: '14px',
    color: '#2e7d32',
    fontWeight: '500',
  },
  completedIcon: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#2e7d32',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
  },
  doneBtn: {
    marginLeft: 'auto',
    padding: '8px 20px',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  },
};
