import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Pull necessary state from Redux
  const { isAuthenticated, user, role } = useAppSelector((state) => state.auth);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-surface border-b border-outline sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to={
                isAuthenticated
                  ? role === "ADMIN"
                    ? "/admin"
                    : "/events"
                  : "/login"
              }
              className="text-2xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity"
            >
              Gatherly
            </Link>
          </div>

          {/* Right Side: Controls & Auth */}
          <div className="flex items-center space-x-4">
            {/* Global Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="px-3 py-2 rounded-md text-sm font-medium text-secondary hover:text-primary hover:bg-surfaceVariant transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {/* User Info & Logout (Only visible if logged in) */}
            {isAuthenticated && (
              <div className="flex items-center space-x-4 border-l border-outline pl-4 ml-2">
                {/* User Details (Hidden on very small screens for responsiveness) */}
                <div className="hidden sm:flex items-center text-sm">
                  <Link
                    to="/profile"
                    className="text-on-surface font-medium hover:text-primary transition-colors cursor-pointer"
                  >
                    {user}
                  </Link>
                  <span className="ml-2 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary text-on-primary rounded-full opacity-90">
                    {role}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-error border border-error rounded-md hover:bg-error hover:text-on-error transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
