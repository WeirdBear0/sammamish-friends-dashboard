import { useState } from 'react';
import { useApp } from '../context/AppContext';
import sfLogo from '../assets/sf.png';

const Leaf = ({ style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="currentColor"
    style={style}
  >
    <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
    <path d="M10 90 C30 75 50 60 70 30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
  </svg>
);

export default function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username.trim(), password);
    if (!success) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      {/* Decorative leaves */}
      <Leaf style={{ ...styles.leaf, top: '-30px', left: '-20px', width: 180, height: 180, color: 'rgba(255,255,255,0.08)', transform: 'rotate(-20deg)' }} />
      <Leaf style={{ ...styles.leaf, bottom: '-40px', right: '-10px', width: 220, height: 220, color: 'rgba(255,255,255,0.06)', transform: 'rotate(160deg)' }} />
      <Leaf style={{ ...styles.leaf, top: '40%', left: '-60px', width: 140, height: 140, color: 'rgba(255,255,255,0.05)', transform: 'rotate(30deg)' }} />
      <Leaf style={{ ...styles.leaf, top: '10%', right: '-30px', width: 120, height: 120, color: 'rgba(255,255,255,0.07)', transform: 'rotate(-140deg)' }} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>
            <img src={sfLogo} alt="Sammamish Friends" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }} />
          </div>
          <div>
            <h1 style={styles.orgName}>Sammamish Friends</h1>
            <p style={styles.orgSub}>IT Task Dashboard</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <p style={styles.loginLabel}>Submit and track IT task requests</p>

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. board"
              autoComplete="username"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitBtn}>
            Sign In
          </button>

          <div style={styles.hint}>
            <span style={styles.hintLabel}>Credentials — </span>
            <span style={styles.hintText}>Username: board / Password: sf2024</span>
          </div>
        </form>
      </div>

      <p style={styles.footer}>
        &copy; {new Date().getFullYear()} Sammamish Friends
      </p>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a5c3a 0%, #2d8a58 40%, #1e7a4a 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  leaf: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  card: {
    background: '#fff',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    position: 'relative',
    zIndex: 1,
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '28px',
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  orgName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a2e1f',
    lineHeight: 1.2,
  },
  orgSub: {
    fontSize: '13px',
    color: '#5a8a6a',
    fontWeight: '400',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loginLabel: {
    fontSize: '13px',
    color: '#6b8f74',
    marginBottom: '4px',
    lineHeight: 1.5,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2a4a32',
  },
  input: {
    padding: '11px 14px',
    border: '1.5px solid #c8e6d0',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#1a2e1f',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#fafffe',
  },
  error: {
    color: '#c0392b',
    fontSize: '13px',
    background: '#fff5f5',
    border: '1px solid #f5c6c6',
    borderRadius: '8px',
    padding: '10px 12px',
  },
  submitBtn: {
    padding: '13px',
    background: 'linear-gradient(135deg, #1a5c3a, #2d8a58)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    marginTop: '4px',
    transition: 'opacity 0.2s',
  },
  hint: {
    textAlign: 'center',
    fontSize: '12px',
    padding: '10px',
    background: '#f0faf4',
    borderRadius: '8px',
  },
  hintLabel: {
    color: '#7aaa85',
  },
  hintText: {
    color: '#3d7a50',
    fontWeight: '500',
  },
  footer: {
    marginTop: '24px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px',
    position: 'relative',
    zIndex: 1,
  },
};
