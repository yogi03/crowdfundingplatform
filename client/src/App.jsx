import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Sidebar, Navbar } from './components';
import { CampaignDetail, CreateCampaign, Home, Profile, Payment, Withdraw } from './pages';

const App = () => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`relative sm:-8 p-4 ${theme === 'dark' ? 'bg-[#13131a]' : 'bg-[#f3f4f6]'} min-h-screen flex flex-row transition-colors duration-300`}>
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/campaign-details/:id" element={<CampaignDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/withdraw" element={<Withdraw />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
