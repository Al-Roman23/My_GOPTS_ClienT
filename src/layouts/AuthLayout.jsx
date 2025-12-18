import React from "react";
import NavBar from "../components/layout/NavBar/NavBar";
import { Outlet } from "react-router";
import Footer from "../components/layout/Footer/Footer";

const AuthLayout = () => {
  return (
    <div className="max-w-[1600px] mx-auto">
      <header>
        <NavBar></NavBar>
      </header>

      <main>
        <Outlet></Outlet>
      </main>

      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default AuthLayout;
