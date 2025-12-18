import React, { useMemo } from "react";
import Logo from "../../Logo/Logo";
import { FaReddit, FaSquareXTwitter, FaYoutube } from "react-icons/fa6";
import { NavLink } from "react-router";

const Footer = () => {
  const year = new Date().getFullYear();

  // Internal Links Memoization
  const internalLinks = useMemo(
    () => [
      { to: "/services", label: "Services" },
      { to: "/coverage", label: "Coverage" },
      { to: "/about", label: "About Us" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
    []
  );

  // Social Links Memoization
  const socialLinks = useMemo(
    () => [
      { href: "https://x.com", icon: <FaSquareXTwitter />, label: "Twitter" },
      { href: "https://youtube.com", icon: <FaYoutube />, label: "YouTube" },
      { href: "https://reddit.com", icon: <FaReddit />, label: "Reddit" },
    ],
    []
  );

  return (
    <footer className="footer footer-horizontal footer-center p-6 md:p-10 bg-gray-700 rounded-2xl text-white gap-y-5">
      {/* Logo And Description */}
      <aside>
        <Logo />
        <p className="font-bold mt-3 leading-relaxed">
          Streamline your garment production and order management with ease and
          efficiency.
          <br />
          From placing orders to tracking production stages — we ensure timely
          delivery and complete visibility for your business.
        </p>
      </aside>

      {/* Internal Navigation */}
      <nav className="grid grid-cols-1 sm:grid-flow-col gap-4">
        {internalLinks.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Social Media Icons */}
      <nav className="grid grid-flow-col gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
          >
            <span className="text-2xl hover:text-gray-300 transition">
              {social.icon}
            </span>
          </a>
        ))}
      </nav>

      {/* Copyright Notice */}
      <p className="opacity-80">
        © 2025–{year} GOPTS Ltd. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
