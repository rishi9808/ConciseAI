"use client";
import React, { useState } from "react";
import { FileText, Upload, Menu, X, FileStack } from "lucide-react";
import { Button } from "../ui/button";
import NavLink from "./nav-link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="container flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex lg:flex-1">
          <NavLink
            href="/"
            className="flex gap-1 lg:gap-2 shrink-0 items-center"
          >
            <FileStack className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 cursor-pointer transform transition duration-300 ease-in-out" />
            <span className="font-extrabold text-gray-900 text-lg lg:text-2xl">
              ConciseAI
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-4 lg:gap-12 lg:justify-center lg:items-center">
          <NavLink href="/#pricing">Pricing</NavLink>
          <SignedIn>
            <NavLink href="/dashboard">Your Summaries</NavLink>
          </SignedIn>
        </div>

        <div className="flex lg:justify-end lg:flex-1 items-center gap-2">
          <SignedIn>
            <div className="flex gap-2 items-center">
              {/* Upload Button - Hidden on mobile, shown on desktop */}
              {/* <div className="text-sm hidden sm:inline-block text-gray-600">
                Pro
              </div> */}
              <div className="hidden sm:flex items-center gap-2">
                <NavLink href="/upload">
                  <Button className="flex bg-gradient-to-r from-rose-500 to-rose-700 text-white hover:from-rose-600 hover:to-rose-800 transition-colors duration-200">
                    <Upload className="w-4 h-4 lg:w-5 lg:h-5 text-white hover:rotate-12 cursor-pointer transform transition duration-300 ease-in-out" />
                    <span className="hidden md:inline-block ml-2">
                      Upload PDF
                    </span>
                  </Button>
                </NavLink>
              </div>

              {/* UserButton - Hidden on mobile, shown on desktop */}
              <div className="hidden sm:block">
                <UserButton />
              </div>

              {/* Mobile Menu Section */}
              <div className="sm:hidden flex items-center gap-2">
                {/* Upload Button for Mobile */}
                {/* <div className="text-xs text-gray-600">Pro</div> */}
                <NavLink href="/upload">
                  <Button
                    size="sm"
                    className="p-2 text-white bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 rounded-md transition-all duration-200 hover:scale-105"
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </Button>
                </NavLink>

                {/* Mobile Menu Button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 hover:scale-105 border-gray-200"
                >
                  <div className="relative w-4 h-4">
                    <Menu
                      className={`w-4 h-4 absolute transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "rotate-90 opacity-0 scale-75"
                          : "rotate-0 opacity-100 scale-100"
                      }`}
                    />
                    <X
                      className={`w-4 h-4 absolute transition-all duration-300 ${
                        isMobileMenuOpen
                          ? "rotate-0 opacity-100 scale-100"
                          : "-rotate-90 opacity-0 scale-75"
                      }`}
                    />
                  </div>
                </Button>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <NavLink href="/sign-in">Sign in</NavLink>
          </SignedOut>
        </div>
      </nav>

      {/* Mobile Menu with Slide Animation */}
      <SignedIn>
        <div
          className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <div
                className={`transform transition-all duration-300 delay-75 ${
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
              >
                <NavLink
                  href="/#pricing"
                  className="block py-2 text-gray-900 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </NavLink>
              </div>
              <div
                className={`transform transition-all duration-300 delay-100 ${
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
              >
                <NavLink
                  href="/dashboard"
                  className="block py-2 text-gray-900 hover:text-rose-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Your Summaries
                </NavLink>
              </div>

              {/* UserButton in Mobile Menu */}
              <div
                className={`transform transition-all duration-300 delay-125 border-t border-gray-100 pt-3 ${
                  isMobileMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-4 opacity-0"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Account:</span>
                  <UserButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default Header;
