"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { UserCircle2 } from "lucide-react";

function Header() {
  const path = usePathname();
  const router = useRouter();
  const { authUser,userLogOut } = useAuthStore();
  const user = authUser;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log("UserFullName", user?.fullName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpgrade = () => router.push("/upgrade");
  const handleWork = () => router.push("/work");
  const handleDashboard = () => router.push("/dashboard");
  const handleLogOut = (e) => {
    e.preventDefault();
    userLogOut();
    router.push("/");
  }

  return (
    <div className="flex items-center justify-between p-6 bg-secondary shadow-sm">
      <button onClick={handleDashboard}>
        <Image src="/mainlogo3.png" width={160} height={100} alt="logo" />
      </button>

      <nav>
        <ul className="hidden md:flex items-center gap-6 text-base">
          <li
            className={`hover:font-bold transition-all cursor-pointer ${path === "/dashboard" ? "text-primary font-bold" : ""
              }`}
            onClick={handleDashboard}
          >
            Dashboard
          </li>
          <li
            className={`hover:font-bold transition-all cursor-pointer ${path === "/upgrade" ? "text-primary font-bold" : ""
              }`}
            onClick={handleUpgrade}
          >
            Upgrade
          </li>
          <li
            className={`hover:font-bold transition-all cursor-pointer ${path === "/work" ? "text-primary font-bold" : ""
              }`}
            onClick={handleWork}
          >
            How it Works?
          </li>
        </ul>
      </nav>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="ml-4 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <UserCircle2 className="w-8 h-8 text-gray-700" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              {user?.fullName || "User"}
            </div>
            <button
              onClick={handleLogOut}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
