import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';

function App() {
  const [view, setView] = useState('welcome'); // welcome, onboarding, dashboard
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for existing session
    const savedUser = localStorage.getItem('openup_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleStart = () => {
    setView('onboarding');
  };

  const handleOnboardingComplete = (userData) => {
    // Create a random user ID if not provided (for now just using name-rand)
    const userId = `${userData.name.toLowerCase().replace(/\s+/g, '_')}_${Math.floor(Math.random() * 1000)}`;
    const fullUser = { ...userData, userId };

    // Save state
    setUser(fullUser);
    localStorage.setItem('openup_user', JSON.stringify(fullUser));

    // Navigate
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('openup_user');
    setUser(null);
    setView('welcome');
  };

  return (
    <Layout>
      {view === 'welcome' && <Welcome onStart={handleStart} />}
      {view === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
      {view === 'dashboard' && user && <Dashboard user={user} onLogout={handleLogout} />}
    </Layout>
  );
}

export default App;
