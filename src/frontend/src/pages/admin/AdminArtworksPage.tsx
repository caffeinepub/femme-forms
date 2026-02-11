import { Link } from '@tanstack/react-router';
import { useGetAllArtworks, useDeleteArtwork } from '../../hooks/useQueries';
import LoadingState from '../../components/states/LoadingState';
import ErrorState from '../../components/states/ErrorState';
import EmptyState from '../../components/states/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Palette } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminArtworksPage() {
  const { data: artworks, isLoading, error, refetch } = useGetAllArtworks();
  const deleteArtwork = useDeleteArtwork();

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteArtwork.mutateAsync(id);
      toast.success(`"${title}" deleted successfully`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete artwork');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading artworks..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load artworks" onRetry={() => refetch()} />;
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Manage Artworks</h1>
          <p className="mt-2 text-muted-foreground">Create, edit, and manage your artwork inventory</p>
        </div>
        <Button asChild>
          <Link to="/admin/artworks/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Artwork
          </Link>
        </Button>
      </div>

      {!artworks || artworks.length === 0 ? (
        <EmptyState
          icon={<Palette className="h-16 w-16" />}
          title="No artworks yet"
          description="Get started by adding your first artwork"
          action={
            <Button asChild>
              <Link to="/admin/artworks/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Artwork
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border shadow-sketch">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artworks.map((artwork) => (
                <TableRow key={artwork.id}>
                  <TableCell className="font-medium">{artwork.title}</TableCell>
                  <TableCell>${Number(artwork.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={artwork.available ? 'default' : 'secondary'}>
                      {artwork.available ? 'Available' : 'Sold'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link to="/admin/artworks/$artworkId/edit" params={{ artworkId: artwork.id }}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{artwork.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(artwork.id, artwork.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
