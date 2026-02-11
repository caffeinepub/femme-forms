import { useGetAllOrders, useMarkOrderHandled, useGetAllArtworks, useGetAllJewelry } from '../../hooks/useQueries';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ItemType } from '../../backend';

export default function AdminOrdersPage() {
  const { data: orders, isLoading, error, refetch } = useGetAllOrders();
  const { data: artworks } = useGetAllArtworks();
  const { data: jewelry } = useGetAllJewelry();
  const markHandled = useMarkOrderHandled();

  const handleMarkHandled = async (orderId: bigint) => {
    try {
      await markHandled.mutateAsync(orderId);
      toast.success('Order marked as handled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order');
    }
  };

  const getItemTitle = (itemId: string, itemType: ItemType) => {
    if (itemType === ItemType.artwork) {
      const artwork = artworks?.find((a) => a.id === itemId);
      return artwork?.title || 'Unknown Artwork';
    } else {
      const jewelryItem = jewelry?.find((j) => j.id === itemId);
      return jewelryItem?.name || 'Unknown Jewelry';
    }
  };

  const getItemTypeLabel = (itemType: ItemType) => {
    return itemType === ItemType.artwork ? 'Artwork' : 'Jewelry';
  };

  if (isLoading) {
    return <LoadingState message="Loading orders..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load orders" onRetry={() => refetch()} />;
  }

  const sortedOrders = [...(orders || [])].sort((a, b) => {
    if (a.handled === b.handled) return Number(b.id - a.id);
    return a.handled ? 1 : -1;
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Purchase Inquiries</h1>
        <p className="mt-2 text-muted-foreground">Review and manage customer purchase requests</p>
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16" />}
          title="No orders yet"
          description="Purchase inquiries will appear here when customers submit them"
        />
      ) : (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <Card key={Number(order.id)} className={order.handled ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Order #{Number(order.id)}
                      <Badge variant={order.handled ? 'secondary' : 'default'}>
                        {order.handled ? 'Handled' : 'New'}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {getItemTypeLabel(order.itemType)}: {getItemTitle(order.itemId, order.itemType)} • Quantity:{' '}
                      {Number(order.quantity)}
                    </CardDescription>
                  </div>
                  {!order.handled && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkHandled(order.id)}
                      disabled={markHandled.isPending}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Mark Handled
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{order.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                  </div>
                </div>
                {order.message && (
                  <div>
                    <p className="text-sm font-medium">Message</p>
                    <p className="text-sm text-muted-foreground">{order.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
