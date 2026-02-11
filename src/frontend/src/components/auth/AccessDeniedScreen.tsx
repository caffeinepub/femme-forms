import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const { identity, login } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-display text-3xl font-semibold">Access Denied</h1>
        <p className="mt-3 text-muted-foreground">
          {identity
            ? 'You do not have permission to access this area. Admin access is required.'
            : 'Please log in to access the admin area.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {!identity ? (
            <Button onClick={login}>Login</Button>
          ) : (
            <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
          )}
        </div>
      </div>
    </div>
  );
}
