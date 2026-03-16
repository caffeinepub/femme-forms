import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import EmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";
import LoadingState from "../components/states/LoadingState";
import JewelryCard from "../components/storefront/JewelryCard";
import { useGetAvailableJewelry } from "../hooks/useQueries";

export default function JewelryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const { data: jewelry, isLoading, error, refetch } = useGetAvailableJewelry();

  const filteredJewelry = jewelry?.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && item.available) ||
      (availabilityFilter === "sold" && !item.available);

    return matchesSearch && matchesAvailability;
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load jewelry collection"
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Jewelry Collection
        </h1>
        <p className="mt-2 text-muted-foreground">
          Handcrafted pieces with rustic elegance and silver shimmer
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jewelry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 shimmer-border"
          />
        </div>
        <Select
          value={availabilityFilter}
          onValueChange={setAvailabilityFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px] shimmer-border">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="available">In Stock</SelectItem>
            <SelectItem value="sold">Sold Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jewelry Grid */}
      {filteredJewelry && filteredJewelry.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredJewelry.map((item) => (
            <JewelryCard key={item.id} jewelry={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No jewelry found"
          description={
            searchQuery || availabilityFilter !== "all"
              ? "Try adjusting your filters"
              : "Check back soon for new pieces"
          }
        />
      )}
    </div>
  );
}
