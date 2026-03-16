import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ItemType } from "../backend";
import ErrorState from "../components/states/ErrorState";
import LoadingState from "../components/states/LoadingState";
import PurchaseInquiryForm from "../components/storefront/PurchaseInquiryForm";
import { useGetArtwork } from "../hooks/useQueries";

export default function ArtworkDetailPage() {
  const { artworkId } = useParams({ from: "/artwork/$artworkId" });
  const navigate = useNavigate();
  const { data: artwork, isLoading, error, refetch } = useGetArtwork(artworkId);

  if (isLoading) {
    return <LoadingState message="Loading artwork..." />;
  }

  if (error || !artwork) {
    return (
      <ErrorState
        message={
          artwork === null ? "Artwork not found" : "Failed to load artwork"
        }
        onRetry={() => refetch()}
      />
    );
  }

  const imageUrl = artwork.image?.getDirectURL();
  const priceFormatted = `$${Number(artwork.price).toFixed(2)}`;

  return (
    <div className="container py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/gallery" })}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Gallery
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-lg bg-muted shadow-sketch">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={artwork.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-muted-foreground">
              <span>No image available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="mb-3 flex items-start justify-between gap-4">
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {artwork.title}
              </h1>
              <Badge
                variant={artwork.available ? "default" : "secondary"}
                className="shrink-0"
              >
                {artwork.available ? "Available" : "Sold"}
              </Badge>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {priceFormatted}
            </p>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground">{artwork.description}</p>
          </div>

          {artwork.available && (
            <PurchaseInquiryForm
              itemId={artwork.id}
              itemType={ItemType.artwork}
              itemName={artwork.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}
