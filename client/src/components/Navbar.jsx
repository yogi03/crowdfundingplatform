import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../context";
import { Menu, X, Search, LayoutDashboard, User } from "lucide-react";

const Navbar = ({
  theme = "dark",
  searchQuery = "",
  setSearchQuery = () => {},
}) => {
  const navigate = useNavigate();
  const { connect, address } = useStateContext();
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const isDark = theme === "dark";

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div
        className={`lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] ${isDark ? "bg-[#1c1c24]" : "bg-white"} rounded-[100px] border ${isDark ? "border-gray-700" : "border-gray-300"}`}
      >
        <input
          type="text"
          placeholder="Search for campaigns"
          value={searchQuery}
          onChange={handleSearch}
          className={`flex w-full font-epilogue font-normal text-[14px] ${isDark ? "placeholder:text-[#4b5264] text-white" : "placeholder:text-gray-400 text-gray-900"} bg-transparent outline-none`}
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
          <Search className="text-white" size={20} />
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        <button
          className={`font-epilogue font-semibold text-[15px] leading-[22px] text-white min-h-[30px] py-2 px-5 rounded-full ${address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}`}
          onClick={() => {
            if (address) navigate("create-campaign");
            else connect();
          }}
        >
          {address ? "Create a campaign" : "Connect"}
        </button>

        <Link to="/profile">
          <div
            className={`w-[52px] h-[52px] rounded-full ${isDark ? "bg-[#2c2f32]" : "bg-gray-300"} flex justify-center items-center cursor-pointer`}
          >
            <User
              size={24}
              className={isDark ? "text-white" : "text-gray-800"}
            />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div
          className={`w-[40px] h-[40px] rounded-[10px] ${isDark ? "bg-[#2c2f32]" : "bg-gray-300"} flex justify-center items-center cursor-pointer`}
        >
          <div className="w-[60%] h-[60%] bg-[#4acd8d] rounded-full" />
        </div>

        <div
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        >
          {toggleDrawer ? (
            <X className={isDark ? "text-white" : "text-gray-900"} />
          ) : (
            <Menu className={isDark ? "text-white" : "text-gray-900"} />
          )}
        </div>

        <div
          className={`absolute top-[60px] right-0 left-0 ${isDark ? "bg-[#1c1c24]" : "bg-white"} z-10 shadow-secondary py-4 ${!toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"} transition-all duration-700`}
        >
          <ul className="mb-4">
            <li
              className={`flex p-4 ${address ? "text-[#1dc071]" : isDark ? "text-[#808191]" : "text-gray-600"}`}
              onClick={() => {
                setToggleDrawer(false);
                navigate("/");
              }}
            >
              <LayoutDashboard className="mr-4" size={24} />
              <p className="font-epilogue font-semibold text-[14px]">
                Dashboard
              </p>
            </li>
          </ul>

          <div className="flex mx-4">
            <button
              className={`font-epilogue font-semibold text-[15px] leading-[22px] text-white min-h-[38px] py-2 px-4 rounded-full w-full ${address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}`}
              onClick={() => {
                if (address) navigate("create-campaign");
                else connect();
              }}
            >
              {address ? "Create a campaign" : "Connect"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
