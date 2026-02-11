import { ReactNode } from 'react';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AccessDeniedScreen from './AccessDeniedScreen';
import LoadingState from '../states/LoadingState';

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
