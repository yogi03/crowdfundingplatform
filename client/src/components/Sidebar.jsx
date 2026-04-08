import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/together.png";
import {
  LayoutDashboard,
  Megaphone,
  Wallet,
  ArrowRightLeft,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

const SidebarIcon = ({
  IconComponent,
  name,
  isActive,
  handleClick,
  disabled,
  theme,
}) => {
  const isDark = theme === "dark";
  return (
    <div
      className={`w-[48px] h-[48px] rounded-[10px] ${isActive === name && (isDark ? "bg-[#2c2f32]" : "bg-gray-300")} flex justify-center items-center ${!disabled && "cursor-pointer"}`}
      onClick={handleClick}
    >
      <IconComponent
        size={24}
        className={`${isActive === name ? "text-[#1dc071]" : isDark ? "text-[#808191]" : "text-gray-600"}`}
      />
    </div>
  );
};

const Sidebar = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");

  const navlinks = [
    { name: "dashboard", Icon: LayoutDashboard, link: "/" },
    { name: "campaign", Icon: Megaphone, link: "/create-campaign" },
    { name: "payment", Icon: Wallet, link: "/payment" },
    { name: "withdraw", Icon: ArrowRightLeft, link: "/withdraw" },
    { name: "profile", Icon: User, link: "/profile" },
    { name: "logout", Icon: LogOut, link: "/", logout: true },
  ];

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <div className="w-[56px] h-[56px] bg-[#1dc071] rounded-full flex justify-center items-center p-[4px]">
          <img
            src={logo}
            alt="Logo"
            className="w-full h-full object-contain rounded-full bg-white"
          />
        </div>
      </Link>

      <div
        className={`flex-1 flex flex-col justify-between items-center ${theme === "dark" ? "bg-[#1c1c24]" : "bg-[#fff] shadow-lg"} rounded-[20px] w-[76px] py-4 mt-12 transition-all duration-300`}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <SidebarIcon
              key={link.name}
              IconComponent={link.Icon}
              name={link.name}
              isActive={isActive}
              disabled={link.disabled}
              theme={theme}
              handleClick={() => {
                if (!link.disabled) {
                  if (link.logout) {
                    // Quick logout logic: redirect and reload
                    window.location.href = "/";
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
          IconComponent={theme === "dark" ? Sun : Moon}
          name="sun"
          isActive={isActive}
          theme={theme}
          handleClick={toggleTheme}
        />
      </div>
    </div>
  );
};

export default Sidebar;
