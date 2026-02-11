import { useState, useMemo } from 'react';
import { useGetAllArtworks } from '../hooks/useQueries';
import ArtworkCard from '../components/storefront/ArtworkCard';
import LoadingState from '../components/states/LoadingState';
import ErrorState from '../components/states/ErrorState';
import EmptyState from '../components/states/EmptyState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Palette } from 'lucide-react';

export default function GalleryPage() {
  const { data: artworks, isLoading, error, refetch } = useGetAllArtworks();
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');

  const filteredArtworks = useMemo(() => {
    if (!artworks) return [];

    return artworks.filter((artwork) => {
      const matchesSearch =
        searchQuery === '' ||
        artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAvailability =
        availabilityFilter === 'all' ||
        (availabilityFilter === 'available' && artwork.available) ||
        (availabilityFilter === 'sold' && !artwork.available);

      return matchesSearch && matchesAvailability;
    });
  }, [artworks, searchQuery, availabilityFilter]);

  if (isLoading) {
    return <LoadingState message="Loading gallery..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load artworks" onRetry={() => refetch()} />;
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Gallery</h1>
        <p className="mt-2 text-muted-foreground">Browse our collection of original artworks</p>
      </div>

      {/* Filters */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger id="availability">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Artworks</SelectItem>
              <SelectItem value="available">Available Only</SelectItem>
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {filteredArtworks.length === 0 ? (
        <EmptyState
          icon={<Palette className="h-16 w-16" />}
          title="No artworks found"
          description={
            searchQuery || availabilityFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Check back soon for new pieces'
          }
        />
      ) : (
        <>
          <p className="mb-6 text-sm text-muted-foreground">
            Showing {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
