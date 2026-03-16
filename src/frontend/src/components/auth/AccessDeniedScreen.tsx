import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { KeyRound, ShieldAlert } from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export default function AccessDeniedScreen() {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-semibold">
          Access Denied
        </h1>
        <p className="mt-3 text-muted-foreground">
          {identity
            ? "You do not have permission to access this area. Admin access is required."
            : "Please log in to access the admin area."}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          {!identity ? (
            <Button onClick={login} data-ocid="access.primary_button">
              Login
            </Button>
          ) : (
            <>
              <Button
                onClick={() => navigate({ to: "/" })}
                variant="outline"
                data-ocid="access.secondary_button"
              >
                Go to Home
              </Button>
              <Button
                onClick={() => navigate({ to: "/admin/setup" })}
                className="shimmer-button gap-2"
                data-ocid="access.open_modal_button"
              >
                <KeyRound className="h-4 w-4" />
                Set Up Admin Access
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
