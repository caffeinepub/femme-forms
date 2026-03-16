import type { ReactNode } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../../hooks/useQueries";
import LoadingState from "../states/LoadingState";
import AccessDeniedScreen from "./AccessDeniedScreen";

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isInitializing || isLoading) {
    return <LoadingState message="Checking permissions..." />;
  }

  if (!identity || !isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
