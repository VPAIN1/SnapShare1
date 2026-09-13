import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Feed", path: "/feed" },
    { name: "UploadPost", path: "/publicPosts" },
    { name: "My Posts", path: "/myposts" },
    { name: "About", path: "/about" }
  ];

  const logoutHandler = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `transition ${isActive
      ? "text-black font-bold"
      : "text-gray-600 hover:text-black"
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          <Link to="/home" className="text-2xl font-bold text-black">
            <img
              src="/snap1.png"
              alt="ECOM Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path} className={linkClass}>
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5">

            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <User className="w-5 h-5" />
              <span>
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </span>
            </Link>

            <button
              onClick={logoutHandler}
              disabled={loading}
              className="flex items-center gap-2
                            text-gray-600 hover:text-black
                            disabled:opacity-50 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>


          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-black"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-4">
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


              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                Profile
              </NavLink>

              <button
                onClick={logoutHandler}
                disabled={loading}
                className="flex items-center gap-2
                                text-gray-600 hover:text-black
                                text-left disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;