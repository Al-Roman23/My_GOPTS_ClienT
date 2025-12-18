import React from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaUsers,
  FaBoxOpen,
  FaClipboardList,
  FaPlusSquare,
  FaBoxes,
  FaCheckCircle,
  FaUserCircle,
  FaShoppingCart,
  FaMapMarkedAlt,
  FaHome,
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";
import Logo from "../components/Logo/Logo";

const SidebarLink = ({ to, icon: Icon, label }) => (
  <li>
    <NavLink
      to={to}
      className="group flex items-center gap-5 p-5 rounded-lg relative"
    >
      {({ isActive }) => (
        <>
          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full transition-colors duration-200 ${
              isActive ? "bg-base-300" : ""
            }`}
          ></div>
          <div className="flex items-center gap-3 relative z-10">
            <Icon className="text-2xl" />
            <span className="is-drawer-close:hidden font-medium text-base">
              {label}
            </span>
          </div>
          <span className="absolute left-20 top-1/2 -translate-y-1/2 bg-base-200 px-3 py-1 rounded-lg shadow-md font-medium text-base opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none is-drawer-open:hidden whitespace-nowrap">
            {label}
          </span>
        </>
      )}
    </NavLink>
  </li>
);

const DashboardLayout = () => {
  const { role, isLoading } = useUserRole();
  if (isLoading) return <div className="loading loading-spinner"></div>;

  const roleLinks = {
    admin: [
      { to: "/dashboard/manage-users", icon: FaUsers, label: "Manage Users" },
      { to: "/dashboard/all-products", icon: FaBoxOpen, label: "All Products" },
      {
        to: "/dashboard/all-orders",
        icon: FaClipboardList,
        label: "All Orders",
      },
    ],
    manager: [
      {
        to: "/dashboard/add-product",
        icon: FaPlusSquare,
        label: "Add Product",
      },
      {
        to: "/dashboard/manage-products",
        icon: FaBoxes,
        label: "Manage Products",
      },
      {
        to: "/dashboard/pending-orders",
        icon: FaClipboardList,
        label: "Pending Orders",
      },
      {
        to: "/dashboard/approved-orders",
        icon: FaCheckCircle,
        label: "Approved Orders",
      },
      { to: "/dashboard/profile", icon: FaUserCircle, label: "My Profile" },
    ],
    buyer: [
      { to: "/dashboard/my-orders", icon: FaShoppingCart, label: "My Orders" },
      {
        to: "/dashboard/track-order",
        icon: FaMapMarkedAlt,
        label: "Track Order",
      },
      { to: "/dashboard/profile", icon: FaUserCircle, label: "My Profile" },
    ],
  };

  return (
    <div className="drawer lg:drawer-open max-w-[1600px] mx-auto">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <nav className="navbar w-full bg-base-300 shadow-md">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-square btn-ghost"
          >
            <span className="text-2xl">☰</span>
          </label>
          <div className="px-4 font-semibold text-lg">GOPTS Dashboard</div>
        </nav>

        <main className="p-4">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-20 is-drawer-open:w-64 shadow-lg transition-width duration-300">
          <ul className="menu w-full grow p-2">
            <li className="mb-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 relative ${
                    isActive ? "bg-base-300 font-semibold" : "hover:bg-base-300"
                  }`
                }
              >
                <Logo size="text-sm" />
                <span className="is-drawer-close:hidden font-medium text-base">
                  Home
                </span>
              </NavLink>
            </li>
            <SidebarLink to="/dashboard" icon={FaHome} label="Dashboard Home" />
            {roleLinks[role]?.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
