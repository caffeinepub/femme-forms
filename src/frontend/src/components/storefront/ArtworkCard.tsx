import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Artwork } from '../../backend';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const imageUrl = artwork.image?.getDirectURL();
  const priceFormatted = `$${Number(artwork.price).toFixed(2)}`;

  return (
    <Link to="/artwork/$artworkId" params={{ artworkId: artwork.id }} className="group">
      <Card className="overflow-hidden transition-all hover:shadow-metallic-lg shimmer-border shimmer-overlay">
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={artwork.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span className="text-sm">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4 metallic-gradient shimmer-overlay">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-semibold leading-tight truncate">{artwork.title}</h3>
              <p className="mt-1 text-sm font-medium text-shimmer">{priceFormatted}</p>
            </div>
            <Badge variant={artwork.available ? 'default' : 'secondary'} className="shrink-0">
              {artwork.available ? 'Available' : 'Sold'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
