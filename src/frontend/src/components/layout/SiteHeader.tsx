import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsCallerAdmin } from "../../hooks/useQueries";
import LoginButton from "../auth/LoginButton";

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const _navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const navLinks = [
    { label: "Gallery", path: "/gallery" },
    { label: "Jewelry", path: "/jewelry" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b shimmer-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 shimmer-overlay">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <img
            src="/assets/generated/art-logo.dim_512x512.png"
            alt="femme forms"
            className="h-10 w-10"
          />
          <span className="font-display text-xl font-semibold tracking-tight">
            femme forms
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-shimmer"
              activeProps={{ className: "text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-shimmer"
              activeProps={{ className: "text-foreground" }}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LoginButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t shimmer-border bg-background md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
