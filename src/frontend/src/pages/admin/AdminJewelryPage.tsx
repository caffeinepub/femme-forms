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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EmptyState from "../../components/states/EmptyState";
import ErrorState from "../../components/states/ErrorState";
import LoadingState from "../../components/states/LoadingState";
import { useDeleteJewelry, useGetAllJewelry } from "../../hooks/useQueries";

export default function AdminJewelryPage() {
  const { data: jewelry, isLoading, error, refetch } = useGetAllJewelry();
  const deleteJewelryMutation = useDeleteJewelry();

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteJewelryMutation.mutateAsync(id);
      toast.success(`Deleted "${name}"`);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete jewelry item");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState message="Failed to load jewelry items" onRetry={refetch} />
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Jewelry Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your jewelry inventory
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/jewelry/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Jewelry
          </Link>
        </Button>
      </div>

      {jewelry && jewelry.length > 0 ? (
        <div className="rounded-lg border shimmer-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jewelry.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.material}</TableCell>
                  <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.available ? "default" : "secondary"}>
                      {item.available ? "In Stock" : "Sold Out"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link
                          to="/admin/jewelry/$jewelryId/edit"
                          params={{ jewelryId: item.id }}
                        >
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
                            <AlertDialogTitle>
                              Delete Jewelry Item
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{item.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id, item.name)}
                              disabled={deleteJewelryMutation.isPending}
                            >
                              {deleteJewelryMutation.isPending
                                ? "Deleting..."
                                : "Delete"}
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
      ) : (
        <EmptyState
          title="No jewelry items yet"
          description="Get started by adding your first jewelry piece"
          action={
            <Button asChild>
              <Link to="/admin/jewelry/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Jewelry
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
