import { useState, useRef, useEffect } from "react";
import Logo from "../logo/logo.component";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaMoon, FaFileAlt } from "react-icons/fa";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { signOutUser } from "@/store/thunk/auth.thunk";
import { showErrorToast, showInfoToast } from "@/components/ui/toast/toast.component";

interface NavigationComponentProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
}

const NavigationComponent = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userImage = "/images/profile_placeholder.jpg",
}: NavigationComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMenuAction = (action: string) => {
    console.log(`Action clicked: ${action}`);
    setIsDropdownOpen(false);
    // In a real app, these would trigger actual functionality
    if (action === "logout") {
      const result = dispatch(signOutUser());
      if (signOutUser.rejected.match(result)) {
        showErrorToast({ title: "Logout failed", message: result.payload || "Unknown error" });
      } else {
        showInfoToast({ title: "Logged out", message: "You have been logged out successfully" });
      }
    }
  };

  return (
    <nav className="w-full bg-background/50 border-b border-muted/20 sticky top-0 z-50 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Logo
                size={40}
                showText={true}
              />
            </Link>
          </div>

          {/* User Profile Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full">
              {/* Avatar */}
              <div className="h-10 w-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-indigo-200 transition-all">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    className="h-full w-full object-cover"
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white">
                    {userInitials}
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-background/95 rounded-lg shadow-lg border border-muted/20 py-1 z-50 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-95">
                {/* User Info */}
                <div className="px-4 py-3">
                  <p className="text-foreground">{userName}</p>
                  <p
                    className="text-foreground/80"
                    style={{ fontSize: "0.875rem" }}>
                    {userEmail}
                  </p>
                </div>

                <div className="border-t border-muted/20"></div>

                {/* Menu Items */}
                <button
                  onClick={() => handleMenuAction("profile")}
                  className="cursor-pointer w-full px-4 py-2 text-left flex items-center gap-2 text-foreground hover:bg-active/20 transition-colors">
                  <FaUser className="h-4 w-4" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => handleMenuAction("notes")}
                  className="cursor-pointer w-full px-4 py-2 text-left flex items-center gap-2 text-foreground hover:bg-active/20 transition-colors">
                  <FaFileAlt className="h-4 w-4" />
                  <span>My Notes</span>
                </button>

                <div className="border-t border-muted/20 my-1"></div>

                <button
                  onClick={() => handleMenuAction("theme")}
                  className="cursor-pointer w-full px-4 py-2 text-left flex items-center gap-2 text-foreground hover:bg-active/20 transition-colors">
                  <FaMoon className="h-4 w-4" />
                  <span>Appearance</span>
                </button>

                <div className="border-t border-muted/20 my-1"></div>

                <button
                  onClick={() => handleMenuAction("logout")}
                  className="cursor-pointer w-full px-4 py-2 text-left flex items-center gap-2 text-error hover:bg-error/20 rounded-b-lg transition-colors">
                  <FaSignOutAlt className="h-4 w-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationComponent;
