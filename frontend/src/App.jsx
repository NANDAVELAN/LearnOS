import React, { useState, useEffect } from 'react';
import api from './services/api';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Study from './pages/Study';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Progress from './pages/Progress';

export default function App() {
  const [user, setUser] = useState(api.auth.getCurrentUser());
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(null);
      setCurrentView('dashboard');
      setSelectedCourseId(null);
    };

    window.addEventListener('auth-unauthorized', handleAuthChange);
    window.addEventListener('auth-logout', handleAuthChange);

    return () => {
      window.removeEventListener('auth-unauthorized', handleAuthChange);
      window.removeEventListener('auth-logout', handleAuthChange);
    };
  }, []);

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    setCurrentView('dashboard');
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentView('course');
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          if (view !== 'course') {
            setSelectedCourseId(null);
          }
        }}
        user={user}
      />
      <main className="flex-1 overflow-y-auto min-h-screen">
        {currentView === 'dashboard' && (
          <Dashboard user={user} onSelectCourse={handleSelectCourse} />
        )}
        {currentView === 'course' && (
          <Course
            courseId={selectedCourseId}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedCourseId(null);
            }}
          />
        )}
        {currentView === 'study' && <Study />}
        {currentView === 'quiz' && <Quiz />}
        {currentView === 'flashcards' && <Flashcards />}
        {currentView === 'progress' && <Progress />}
      </main>
    </div>
  );
}

