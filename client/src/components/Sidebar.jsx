import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Wallet, 
  ArrowRightLeft, 
  User, 
  LogOut, 
  Sun,
  Moon
} from 'lucide-react';

const SidebarIcon = ({ IconComponent, name, isActive, handleClick, disabled }) => (
  <div 
    className={`w-[48px] h-[48px] rounded-[10px] ${isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'}`}
    onClick={handleClick}
  >
    <IconComponent 
      size={24} 
      className={`${isActive === name ? 'text-[#1dc071]' : 'text-[#808191]'}`} 
    />
  </div>
);

const Sidebar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');

  const navlinks = [
    { name: 'dashboard', Icon: LayoutDashboard, link: '/' },
    { name: 'campaign', Icon: Megaphone, link: '/create-campaign' },
    { name: 'payment', Icon: Wallet, link: '/payment' },
    { name: 'withdraw', Icon: ArrowRightLeft, link: '/withdraw' },
    { name: 'profile', Icon: User, link: '/profile' },
    { name: 'logout', Icon: LogOut, link: '/', logout: true },
  ];

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className="w-[52px] h-[52px] bg-[#2c2f32] rounded-[12px] flex justify-center items-center">
             <div className="w-[60%] h-[60%] bg-[#1dc071] rounded-[8px]" />
        </div>
      </Link>

      <div className={`flex-1 flex flex-col justify-between items-center ${theme === 'dark' ? 'bg-[#1c1c24]' : 'bg-[#fff] shadow-lg'} rounded-[20px] w-[76px] py-4 mt-12 transition-all duration-300`}>
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <SidebarIcon 
              key={link.name}
              IconComponent={link.Icon}
              name={link.name}
              isActive={isActive}
              disabled={link.disabled}
              handleClick={() => {
                if(!link.disabled) {
                  if(link.logout) {
                    // Quick logout logic: redirect and reload
                    window.location.href = '/'; 
                  } else {
                    setIsActive(link.name);
                    navigate(link.link);
                  }
                }
              }}
            />
          ))}
        </div>

        <SidebarIcon 
          IconComponent={theme === 'dark' ? Sun : Moon} 
          name="sun" 
          isActive={isActive} 
          handleClick={toggleTheme}
        />
      </div>
    </div>
  )
}

export default Sidebar
