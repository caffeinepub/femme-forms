import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../../hooks/useActor";

export default function AdminSetupPage() {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actor } = useActor();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }
    setIsSubmitting(true);
    try {
      await actor._initializeAccessControlWithSecret(token);
      const isAdmin = await actor.isCallerAdmin();
      if (isAdmin) {
        toast.success("Admin access granted! Welcome to femme forms.");
        navigate({ to: "/admin" });
      } else {
        toast.error(
          "Token incorrect. Check your Caffeine project settings for the Admin Token.",
        );
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      {/* Shimmer background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="shimmer-orb shimmer-orb-1" />
        <div className="shimmer-orb shimmer-orb-2" />
      </div>

      <Card className="relative w-full max-w-md border border-silver/30 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        {/* Shimmer top bar */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-silver to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-silver/5 to-transparent pointer-events-none" />

        <CardHeader className="text-center pb-2 pt-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-silver/10 border border-silver/30 flex items-center justify-center shimmer-icon">
            <ShieldCheck className="w-8 h-8 text-silver" />
          </div>
          <CardTitle
            className="font-display text-2xl tracking-tight"
            data-ocid="setup.panel"
          >
            Claim Admin Access
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2 text-sm leading-relaxed">
            To get admin access, enter your Admin Token from your Caffeine
            project settings. Look for{" "}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              CAFFEINE_ADMIN_TOKEN
            </span>{" "}
            or
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded ml-1">
              Admin Token
            </span>{" "}
            in your project dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="admin-token"
                className="text-sm font-medium flex items-center gap-2"
              >
                <KeyRound className="w-3.5 h-3.5 text-silver" />
                Admin Token
              </Label>
              <Input
                id="admin-token"
                type="password"
                placeholder="Enter your admin token..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="border-silver/30 bg-background/50 focus:border-silver focus:ring-silver/20"
                autoComplete="current-password"
                data-ocid="setup.input"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !token.trim()}
              className="w-full shimmer-button font-semibold tracking-wide"
              data-ocid="setup.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Claim Admin Access
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              This token is found in your Caffeine.ai project dashboard under
              security settings.
            </p>
          </form>
        </CardContent>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
      </Card>
    </div>
  );
}
