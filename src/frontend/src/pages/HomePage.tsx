import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useGetAvailableArtworks } from '../hooks/useQueries';
import ArtworkCard from '../components/storefront/ArtworkCard';
import LoadingState from '../components/states/LoadingState';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { data: artworks, isLoading } = useGetAvailableArtworks();

  const featuredArtworks = artworks?.slice(0, 3) || [];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center shimmer-overlay"
        style={{ backgroundImage: 'url(/assets/generated/hero-paper-texture.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              femme forms
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Celebrating the beauty, sensuality, and grace of the feminine form through hand-drawn sketches. Each piece captures the essence of women's faces, bodies, and spirit with artistic elegance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="shimmer-glow">
                <Link to="/gallery">
                  Browse Gallery <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shimmer-border shimmer-glow">
                <Link to="/jewelry">View Jewelry</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Featured Artworks</h2>
          <p className="mt-3 text-muted-foreground">Explore original sketches celebrating feminine beauty</p>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : featuredArtworks.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArtworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="shimmer-border shimmer-glow">
                <Link to="/gallery">
                  View All Artworks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <p>No artworks available yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
}
