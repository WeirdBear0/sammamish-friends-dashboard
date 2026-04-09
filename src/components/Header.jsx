import { useApp } from '../context/AppContext';
import sfLogo from '../assets/sf.png';

export default function Header() {
  const { logout } = useApp();

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>
            <img src={sfLogo} alt="Sammamish Friends" style={styles.logoImg} />
          </div>
          <span style={styles.brandName}>Sammamish Friends</span>
        </div>

        <button onClick={logout} style={styles.logoutBtn}>
          Sign out
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: 'linear-gradient(135deg, #1a5c3a 0%, #2d8a58 100%)',
    padding: '0 20px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoBox: {
    width: 36,
    height: 36,
    borderRadius: '10px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  brandName: {
    fontWeight: '700',
    fontSize: '16px',
    color: '#ffffff',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: '500',
  },
};
