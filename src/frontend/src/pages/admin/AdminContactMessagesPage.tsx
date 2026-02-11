import { useGetAllContactMessages } from '../../hooks/useQueries';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

export default function AdminContactMessagesPage() {
  const { data: messages, isLoading, error, refetch } = useGetAllContactMessages();

  if (isLoading) {
    return <LoadingState message="Loading messages..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load messages" onRetry={() => refetch()} />;
  }

  const sortedMessages = [...(messages || [])].sort((a, b) => Number(b.id - a.id));

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Contact Messages</h1>
        <p className="mt-2 text-muted-foreground">Messages submitted through the contact form</p>
      </div>

      {!messages || messages.length === 0 ? (
        <EmptyState
          icon={<Mail className="h-16 w-16" />}
          title="No messages yet"
          description="Contact form submissions will appear here"
        />
      ) : (
        <div className="space-y-4">
          {sortedMessages.map((message) => (
            <Card key={Number(message.id)}>
              <CardHeader>
                <CardTitle>Message #{Number(message.id)}</CardTitle>
                <CardDescription>
                  From: {message.name} ({message.email})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
