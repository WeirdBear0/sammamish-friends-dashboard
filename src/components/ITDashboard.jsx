import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TaskCard from './TaskCard';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

const LeafAccent = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" width="18" height="18">
    <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
  </svg>
);

export default function ITDashboard() {
  const { tasks, tasksLoading } = useApp();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const completed = tasks.filter((t) => t.status === 'completed').length;

  const filtered = tasks
    .filter((t) => {
      if (filter === 'Pending') return t.status === 'pending';
      if (filter === 'In Progress') return t.status === 'in-progress';
      if (filter === 'Completed') return t.status === 'completed';
      return true;
    })
    .filter((t) =>
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (b.status === 'completed' && a.status !== 'completed') return -1;
      const pa = PRIORITY_ORDER[a.priority] ?? 2;
      const pb = PRIORITY_ORDER[b.priority] ?? 2;
      if (pa !== pb) return pa - pb;
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

  return (
    <div style={styles.page} className="dash-page">
      {/* Stats */}
      <div style={styles.statsGrid}>
        <StatCard
          label="Pending"
          value={pending}
          color="#f57f17"
          bg="#fff8e1"
          border="#ffe082"
          description="Awaiting IT team pickup"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          color="#1565c0"
          bg="#e3f2fd"
          border="#90caf9"
          description="Currently being worked on"
        />
        <StatCard
          label="Completed"
          value={completed}
          color="#2e7d32"
          bg="#e8f5e9"
          border="#a5d6a7"
          description="Successfully resolved"
        />
        <StatCard
          label="Total Tasks"
          value={tasks.length}
          color="#1a5c3a"
          bg="#f0faf4"
          border="#c8e6d0"
          description="All submitted requests"
        />
      </div>

      {/* Task List */}
      <div style={styles.listSection}>
        <div style={styles.listHeader}>
          <div style={styles.listTitleRow}>
            <span style={styles.listIcon}><LeafAccent /></span>
            <h2 style={styles.listTitle}>Task Requests</h2>
          </div>

          <div style={styles.controls} className="dash-controls">
            <input
              style={styles.searchInput}
              className="dash-search"
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={styles.filterTabs} className="dash-filter-tabs">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  style={{ ...styles.filterTab, ...(filter === f ? styles.filterTabActive : {}) }}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === 'Pending' && pending > 0 && (
                    <span style={styles.filterBadge}>{pending}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {tasksLoading ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>Loading tasks…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyLeaf}><LeafAccent /></div>
            <p style={styles.emptyTitle}>No tasks found</p>
            <p style={styles.emptyText}>
              {search ? 'Try adjusting your search.' : 'No tasks match this filter yet.'}
            </p>
          </div>
        ) : (
          <div style={styles.taskList}>
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg, border, description }) {
  return (
    <div style={{ ...styles.stat, background: bg, borderColor: border }}>
      <div style={{ ...styles.statValue, color }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statDesc}>{description}</div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '28px 24px 48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  stat: {
    borderRadius: '14px',
    padding: '20px',
    border: '1.5px solid',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: '800',
    lineHeight: 1,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a2e1f',
    marginBottom: '4px',
  },
  statDesc: {
    fontSize: '12px',
    color: '#7aaa85',
  },
  listSection: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid #e8f5e9',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  listHeader: {
    padding: '20px 20px 0',
    borderBottom: '1px solid #e8f5e9',
    paddingBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  listTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1a5c3a',
  },
  listIcon: {
    color: '#2d8a58',
    display: 'flex',
  },
  listTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#1a2e1f',
  },
  controls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    padding: '8px 13px',
    border: '1.5px solid #c8e6d0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#1a2e1f',
    outline: 'none',
    background: '#fafffe',
    width: '200px',
    fontFamily: 'inherit',
  },
  filterTabs: {
    display: 'flex',
    gap: '4px',
    background: '#f0faf4',
    borderRadius: '10px',
    padding: '3px',
  },
  filterTab: {
    padding: '7px 14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#5a8a6a',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
  },
  filterTabActive: {
    background: '#fff',
    color: '#1a5c3a',
    fontWeight: '700',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  filterBadge: {
    background: '#f57f17',
    color: '#fff',
    fontSize: '10px',
    fontWeight: '700',
    padding: '1px 6px',
    borderRadius: '10px',
  },
  empty: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#9ab9a0',
  },
  emptyLeaf: {
    fontSize: '40px',
    marginBottom: '12px',
    color: '#c8e6d0',
    display: 'flex',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#5a8a6a',
    marginBottom: '6px',
  },
  emptyText: {
    fontSize: '13px',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '10px',
  },
};
