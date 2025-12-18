import React from "react";
import useUserRole from "../../../hooks/useUserRole";

const DashboardHome = () => {
  const { role } = useUserRole();

  return (
    <div>
      <h1 className="text-xl font-bold mb-5">Dashboard Home</h1>

      {role === "admin" && (
        <div>
          <p>Welcome, Admin! You can manage users, products, and orders.</p>
        </div>
      )}

      {role === "manager" && (
        <div>
          <p>Welcome, Manager! You can manage products and orders.</p>
        </div>
      )}

      {role === "buyer" && (
        <div>
          <p>Welcome, Buyer! You can view your orders and track shipments.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
