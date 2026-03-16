import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import type { Jewelry } from "../../backend";

interface JewelryCardProps {
  jewelry: Jewelry;
}

export default function JewelryCard({ jewelry }: JewelryCardProps) {
  const imageUrl = jewelry.image?.getDirectURL();
  const priceFormatted = `$${Number(jewelry.price).toFixed(2)}`;

  return (
    <Link
      to="/jewelry/$jewelryId"
      params={{ jewelryId: jewelry.id }}
      className="group"
    >
      <Card className="overflow-hidden transition-all hover:shadow-metallic-lg shimmer-border shimmer-overlay">
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={jewelry.name}
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
              <h3 className="font-display text-lg font-semibold leading-tight truncate">
                {jewelry.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {jewelry.type}
              </p>
              <p className="mt-1 text-sm font-medium text-shimmer">
                {priceFormatted}
              </p>
            </div>
            <Badge
              variant={jewelry.available ? "default" : "secondary"}
              className="shrink-0"
            >
              {jewelry.available ? "In Stock" : "Sold Out"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
