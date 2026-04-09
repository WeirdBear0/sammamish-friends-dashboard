import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const AppContext = createContext(null);

const USERS = {
  admin: { password: 'itteam123', role: 'it', name: 'IT Team Admin' },
  board: { password: 'sf2024', role: 'board', name: 'Board Member' },
};

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('sf_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('submittedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTasksLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('sf_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('sf_user');
    }
  }, [currentUser]);

  const login = (username, password) => {
    const user = USERS[username.toLowerCase()];
    if (user && user.password === password) {
      setCurrentUser({ username: username.toLowerCase(), role: user.role, name: user.name });
      return true;
    }
    return false;
  };

  const logout = () => setCurrentUser(null);

  const addTask = async (taskData) => {
    await addDoc(collection(db, 'tasks'), {
      ...taskData,
      status: 'pending',
      submittedBy: currentUser.username,
      submittedByName: currentUser.name,
      submittedAt: new Date().toISOString(),
      progressNotes: [],
      completedAt: null,
    });
  };

  const addProgressNote = async (taskId, noteText) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const note = {
      id: Date.now().toString(),
      text: noteText,
      author: currentUser.name,
      date: new Date().toISOString(),
    };
    await updateDoc(doc(db, 'tasks', taskId), {
      progressNotes: [...task.progressNotes, note],
      status: task.status === 'pending' ? 'in-progress' : task.status,
    });
  };

  const completeTask = async (taskId) => {
    await updateDoc(doc(db, 'tasks', taskId), {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const updateTaskStatus = async (taskId, status) => {
    await updateDoc(doc(db, 'tasks', taskId), { status });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        tasks,
        tasksLoading,
        login,
        logout,
        addTask,
        addProgressNote,
        completeTask,
        deleteTask,
        updateTaskStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
