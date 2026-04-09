import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import Header from './components/Header';
import ITDashboard from './components/ITDashboard';
import BoardDashboard from './components/BoardDashboard';

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0faf4' }}>
      <Header />
      {currentUser.role === 'it' ? <ITDashboard /> : <BoardDashboard />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
