import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router";
import Logo from "../../Logo/Logo";
import useAuth from "../../../hooks/useAuth";
import userIcon from "../../../assets/user.png";

const NavBar = () => {
  const { user, logOut } = useAuth();

  const links = useMemo(() => {
    const baseLinks = [
      { to: "/", label: "Home" },
      { to: "/all-products", label: "All Products" },
      { to: "/track-order", label: "Track Order" },
    ];

    if (user) {
      baseLinks.push({ to: "/dashboard", label: "Dashboard" });
    } else {
      baseLinks.push(
        { to: "/about", label: "About Us" },
        { to: "/contact", label: "Contact" }
      );
    }

    return baseLinks;
  }, [user]);

  const renderLink = (link) => (
    <NavLink
      key={link.to}
      to={link.to}
      className={({ isActive }) =>
        `px-2 py-1 rounded hover:text-primary transition-colors ${
          isActive ? "font-semibold text-primary" : ""
        }`
      }
    >
      {link.label}
    </NavLink>
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogOut = async () => {
    try {
      await logOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar bg-base-100 shadow-sm rounded-2xl px-4 md:px-6 lg:px-8">
      <div className="navbar-start flex items-center gap-2">
        <div className="dropdown lg:hidden">
          <button tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            {links.map(renderLink)}
          </ul>
        </div>

        <NavLink to="/" className="flex items-center">
          <Logo size="text-xl" />
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {links.map(renderLink)}
        </ul>
      </div>

      <div className="navbar-end flex gap-3 items-center">
        {user ? (
          <div className="relative flex items-center gap-4">
            <img
              className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer transition-opacity hover:opacity-80"
              src={user.photoURL || userIcon}
              alt={user.name || user.email}
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
            />
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 bg-white shadow-md border border-gray-200 w-56 text-gray-800 rounded-md z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100 text-sm text-left">
                  <NavLink
                    to="/dashboard/profile"
                    className="font-semibold truncate hover:underline hover:text-blue-700 transition-colors duration-150"
                  >
                    {user.name || user.email}
                  </NavLink>
                </div>
                <button
                  onClick={handleLogOut}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-white transition-colors duration-150"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-outline">
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="btn bg-primary hover:bg-primary-focus"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
