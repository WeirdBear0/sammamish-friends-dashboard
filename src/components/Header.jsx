import { useApp } from '../context/AppContext';

const LeafIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" width="22" height="22">
    <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
    <path d="M10 90 C30 75 50 60 70 30" stroke="rgba(255,255,255,0.4)" strokeWidth="3" fill="none" />
  </svg>
);

const SmallLeaf = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" width="14" height="14">
    <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
  </svg>
);

export default function Header() {
  const { currentUser, logout } = useApp();

  const roleLabel = currentUser?.role === 'it' ? 'IT Team' : 'Board Member';
  const roleBadgeColor = currentUser?.role === 'it'
    ? { bg: 'rgba(255,255,255,0.2)', text: '#ffffff' }
    : { bg: 'rgba(255,255,255,0.15)', text: '#d4f0e0' };

  return (
    <header style={styles.header}>
      {/* Decorative leaves */}
      <div style={styles.leafDecorRight}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="rgba(255,255,255,0.07)" width="120" height="120">
          <path d="M10 90 C10 90 15 45 55 20 C75 8 92 8 92 8 C92 8 92 25 80 45 C65 70 20 75 10 90 Z" />
        </svg>
      </div>

      <div style={styles.inner}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>
            <LeafIcon />
          </div>
          <div>
            <span style={styles.brandName}>Sammamish Friends</span>
            <span style={styles.brandSep}> — </span>
            <span style={styles.brandSub}>IT Task Dashboard</span>
          </div>
        </div>

        <div style={styles.userArea}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {currentUser?.name?.charAt(0) ?? '?'}
            </div>
            <div style={styles.userText}>
              <span style={styles.userName}>{currentUser?.name}</span>
              <span style={{ ...styles.roleBadge, background: roleBadgeColor.bg, color: roleBadgeColor.text }}>
                <SmallLeaf />
                {roleLabel}
              </span>
            </div>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1a5c3a 0%, #2d8a58 100%)',
    padding: '0 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    overflow: 'hidden',
  },
  leafDecorRight: {
    position: 'absolute',
    right: -20,
    top: -20,
    transform: 'rotate(-30deg)',
    pointerEvents: 'none',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    position: 'relative',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#fff',
  },
  logoBox: {
    width: 38,
    height: 38,
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#ffffff',
  },
  brandSep: {
    color: 'rgba(255,255,255,0.4)',
    margin: '0 2px',
  },
  brandSub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '15px',
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 1,
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: '500',
    padding: '2px 7px',
    borderRadius: '20px',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
};
