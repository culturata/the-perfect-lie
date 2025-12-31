"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { Shield, FolderHeart, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user } = useUser();
  const publicMetadata = user?.publicMetadata as { role?: string } | undefined;
  const isAdmin = publicMetadata?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-lg font-bold text-primary">
            The Perfect Lie
          </span>
        </Link>

        {/* Main Navigation - Desktop */}
        <nav className="hidden md:flex gap-4 lg:gap-5">
          <Link
            href="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Courses
          </Link>
          <Link
            href="/guides"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Guides
          </Link>
          <Link
            href="/flyovers"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Flyovers
          </Link>
          <Link
            href="/news"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            News
          </Link>
          <Link
            href="/resources"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Resources
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/courses" className="w-full cursor-pointer">
                  Courses
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/guides" className="w-full cursor-pointer">
                  Guides
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/flyovers" className="w-full cursor-pointer">
                  Flyovers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/news" className="w-full cursor-pointer">
                  News
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resources" className="w-full cursor-pointer">
                  Resources
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="text-xs px-2">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="text-xs px-3">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            {/* User Menu - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden md:inline-flex">
                <Button variant="ghost" size="sm" className="px-2">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="w-full cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/collections" className="w-full cursor-pointer">
                    <FolderHeart className="h-4 w-4 mr-2" />
                    Collections
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NotificationBell />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
