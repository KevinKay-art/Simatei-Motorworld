/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, LogOut, Car, Shield, Menu, X, Phone } from "lucide-react";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdmin: boolean;
  logout: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, isAdmin, logout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "cars", label: "Inventory" },
    { id: "contact", label: "Contact Us" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab("home")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#D4AF37] rounded flex items-center justify-center font-bold text-black text-xl group-hover:scale-105 transition-transform duration-300">
              S
            </div>
            <div>
              <span className="font-display text-lg font-bold tracking-tight text-white block">
                SIMATEI <span className="text-[#D4AF37]">MOTORWORLD</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/50 block -mt-1">
                Motion Reimagined
              </span>
            </div>
          </div>
 
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                  currentTab === item.id
                    ? "text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
 
            <button
              id="nav-admin"
              onClick={() => setCurrentTab("admin")}
              className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 ${
                currentTab === "admin"
                  ? "text-[#D4AF37] border-b-2 border-[#D4AF37] font-bold"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                  <span>Dashboard</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Admin Login</span>
                </>
              )}
            </button>
 
            {isAdmin && (
              <button
                id="btn-logout"
                onClick={logout}
                className="ml-4 flex items-center space-x-1 px-4 py-2 text-xs font-mono uppercase tracking-wider text-red-400 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors duration-300"
                title="Logout Admin Session"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            
            <a 
              href="tel:0740892332"
              className="ml-6 flex items-center space-x-2 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call 0740892332</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {isAdmin && (
              <button
                onClick={logout}
                className="mr-3 p-1.5 text-red-400 border border-red-500/20 rounded hover:bg-red-500/10"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#D4AF37]" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-white/10 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                currentTab === item.id
                  ? "text-[#D4AF37] bg-white/5 font-semibold"
                  : "text-gray-300 hover:text-[#D4AF37]"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              setCurrentTab("admin");
              setMobileMenuOpen(false);
            }}
            className={`flex items-center space-x-2 w-full text-left px-4 py-3 rounded-md text-base font-medium transition-all duration-200 ${
              currentTab === "admin"
                ? "text-[#D4AF37] bg-white/5 font-semibold"
                : "text-gray-300 hover:text-[#D4AF37]"
            }`}
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                <span>Admin Dashboard</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 text-gray-400" />
                <span>Admin Login</span>
              </>
            )}
          </button>

          <a 
            href="tel:0740892332"
            className="flex items-center justify-center space-x-2 w-full mt-4 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-semibold py-3 rounded-lg text-center"
          >
            <Phone className="h-4 w-4" />
            <span>Call 0740892332</span>
          </a>
        </div>
      )}
    </nav>
  );
}
