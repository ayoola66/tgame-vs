"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Gamepad2,
  HelpCircle,
  Music,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Package,
  BarChart3,
  Gift,
  Home,
  GamepadIcon,
  FolderTree,
  ShoppingBag,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
    permissions: [],
  },
  {
    name: "Games",
    href: "/admin/games",
    icon: GamepadIcon,
    permissions: ["games.read"],
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    permissions: ["categories.read"],
  },
  {
    name: "Questions",
    href: "/admin/questions",
    icon: HelpCircle,
    permissions: ["questions.read"],
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    permissions: ["users.read"],
  },
  {
    name: "Store",
    href: "/admin/store",
    icon: ShoppingBag,
    permissions: ["products.read"],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: Package,
    permissions: ["orders.read"],
  },
  {
    name: "Music",
    href: "/admin/music",
    icon: Music,
    permissions: ["music.read"],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    permissions: ["analytics.read"],
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: Gift,
    permissions: ["coupons.read"],
  },
  {
    name: "Admins",
    href: "/admin/admins",
    icon: Shield,
    permissions: ["admins.read"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permissions: ["system.read"],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/signin" });
  };

  // Filter navigation items based on user permissions
  const visibleNavItems = navigationItems.filter((item) => {
    if (item.permissions.length === 0) return true;
    // Here you would implement actual permission checking
    return true; // For now, show all items
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <SidebarContent pathname={pathname} onSignOut={handleSignOut} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  onSignOut,
}: {
  pathname: string;
  onSignOut: () => void;
}) {
  return (
    <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4 mb-5">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="Elite Games"
              fill
              sizes="(max-width: 768px) 40px, 40px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-900">Elite Games</span>
        </Link>
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150
                ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 flex-shrink-0 h-6 w-6
                  ${
                    isActive
                      ? "text-gray-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  }
                `}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 mt-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 text-gray-700 hover:text-gray-900"
          onClick={onSignOut}
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
