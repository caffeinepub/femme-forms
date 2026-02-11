import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useGetJewelry } from '../hooks/useQueries';
import LoadingState from '../components/states/LoadingState';
import ErrorState from '../components/states/ErrorState';
import PurchaseInquiryForm from '../components/storefront/PurchaseInquiryForm';
import { ItemType } from '../backend';

export default function JewelryDetailPage() {
  const { jewelryId } = useParams({ from: '/jewelry/$jewelryId' });
  const { data: jewelry, isLoading, error, refetch } = useGetJewelry(jewelryId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !jewelry) {
    return <ErrorState message="Failed to load jewelry details" onRetry={refetch} />;
  }

  const imageUrl = jewelry.image?.getDirectURL();
  const priceFormatted = `$${Number(jewelry.price).toFixed(2)}`;
  const weightFormatted = `${Number(jewelry.weightGram)}g`;

  return (
    <div className="container py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/jewelry">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jewelry
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted shimmer-border shimmer-overlay">
          {imageUrl ? (
            <img src={imageUrl} alt={jewelry.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span>No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <Badge variant={jewelry.available ? 'default' : 'secondary'} className="mb-3">
              {jewelry.available ? 'In Stock' : 'Sold Out'}
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight">{jewelry.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-shimmer">{priceFormatted}</p>
          </div>

          <Card className="mb-6 shimmer-border shimmer-overlay">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{jewelry.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Material:</span>
                <span className="font-medium">{jewelry.material}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weight:</span>
                <span className="font-medium">{weightFormatted}</span>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <h2 className="mb-2 font-display text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{jewelry.description}</p>
          </div>

          {jewelry.available && (
            <PurchaseInquiryForm itemId={jewelry.id} itemType={ItemType.jewelry} itemName={jewelry.name} />
          )}
        </div>
      </div>
    </div>
  );
}
