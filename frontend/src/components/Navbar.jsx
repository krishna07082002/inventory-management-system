import React from "react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-5 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-2xl">
          <span>Welcome back,</span>
          <span className="font-semibold text-gray-700">Admin</span>
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-semibold cursor-pointer hover:bg-indigo-200 transition">
          A
        </div>
      </div>
    </div>
  );
};

export default Navbar;