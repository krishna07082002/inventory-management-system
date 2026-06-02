import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navLinks = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/products", label: "Products", icon: "📦" },
    { to: "/customers", label: "Customers", icon: "👥" },
    { to: "/orders", label: "Orders", icon: "📋" },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo / Header */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
            IS
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="text-xs text-gray-500 -mt-1">System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer (Optional) */}
        <div className="absolute bottom-6 px-6 w-full">
          <div className="text-xs text-gray-400 px-5">
            © 2026 Inventory System
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;