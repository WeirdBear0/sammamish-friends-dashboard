import { createContext, useContext, useState, useEffect } from 'react';

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

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('sf_tasks_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return SAMPLE_TASKS;
    }
  });

  useEffect(() => {
    localStorage.setItem('sf_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

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

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      status: 'pending',
      submittedBy: currentUser.username,
      submittedByName: currentUser.name,
      submittedAt: new Date().toISOString(),
      progressNotes: [],
      completedAt: null,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const addProgressNote = (taskId, noteText) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const note = {
          id: Date.now().toString(),
          text: noteText,
          author: currentUser.name,
          date: new Date().toISOString(),
        };
        return {
          ...task,
          status: task.status === 'pending' ? 'in-progress' : task.status,
          progressNotes: [...task.progressNotes, note],
        };
      })
    );
  };

  const completeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: 'completed', completedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const updateTaskStatus = (taskId, status) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status } : task))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        tasks,
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
