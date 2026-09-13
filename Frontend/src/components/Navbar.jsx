import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  Sparkles,
} from "lucide-react";
import { logoutAPI } from "@/services/api";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to sync auth state from localStorage dynamically
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token);
    try {
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for custom login/logout events across components
    window.addEventListener("auth-change", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Feed", path: "/feed" },
    { name: "Upload Post", path: "/publicPosts" },
    { name: "My Posts", path: "/myposts" },
    { name: "About", path: "/about" },
  ];

  const logoutHandler = async () => {
    try {
      setLoading(true);
      await logoutAPI();

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Trigger dynamic auth state update
      window.dispatchEvent(new Event("auth-change"));

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `transition text-sm font-medium py-1 px-3 rounded-lg ${
      isActive
        ? "text-white bg-purple-600/30 border border-purple-400/30 shadow-sm"
        : "text-purple-200/80 hover:text-white hover:bg-white/5"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-purple-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-white group">
            <img
              src="/snap1.png"
              alt="SnapShare Logo"
              className="h-9 w-auto object-contain transform group-hover:scale-105 transition"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-purple-200 hover:text-white text-sm bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 transition"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="max-w-[120px] truncate">
                    {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "Profile"}
                  </span>
                </Link>

                <button
                  onClick={logoutHandler}
                  disabled={loading}
                  className="flex items-center gap-2 text-purple-200 hover:text-red-400 text-sm bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 transition disabled:opacity-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                style={{ backgroundColor: "#59168B" }}
                className="flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition shadow-md cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-1 rounded-lg bg-white/5 border border-white/10"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-3 bg-purple-950/95 backdrop-blur-2xl px-2 rounded-b-2xl shadow-2xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={linkClass}
                >
                  {link.name}
                </NavLink>
              ))}

              {isLoggedIn ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-purple-200 hover:text-white py-2 px-3 text-sm rounded-lg hover:bg-white/5"
                  >
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Profile</span>
                  </NavLink>

                  <button
                    onClick={logoutHandler}
                    disabled={loading}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2 px-3 text-sm text-left rounded-lg hover:bg-white/5 disabled:opacity-50 cursor-pointer w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{loading ? "Logging out..." : "Logout"}</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{ backgroundColor: "#59168B" }}
                  className="flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;