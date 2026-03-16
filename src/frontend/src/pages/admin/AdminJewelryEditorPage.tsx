import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import LoadingState from "../../components/states/LoadingState";
import {
  useCreateJewelry,
  useGetJewelry,
  useSetJewelryImage,
  useUpdateJewelry,
} from "../../hooks/useQueries";

export default function AdminJewelryEditorPage() {
  const params = useParams({ strict: false });
  const jewelryId = params.jewelryId;
  const isEditing = !!jewelryId;
  const navigate = useNavigate();

  const { data: jewelry, isLoading } = useGetJewelry(jewelryId || "", {
    enabled: isEditing,
  });
  const createMutation = useCreateJewelry();
  const updateMutation = useUpdateJewelry();
  const setImageMutation = useSetJewelryImage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");
  const [weightGram, setWeightGram] = useState("");
  const [type, setType] = useState("");
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (jewelry) {
      setName(jewelry.name);
      setDescription(jewelry.description);
      setPrice(Number(jewelry.price).toString());
      setMaterial(jewelry.material);
      setWeightGram(Number(jewelry.weightGram).toString());
      setType(jewelry.type);
      setAvailable(jewelry.available);
    }
  }, [jewelry]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !price ||
      !material.trim() ||
      !weightGram ||
      !type.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const priceNum = Number.parseFloat(price);
    const weightNum = Number.parseInt(weightGram);

    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (Number.isNaN(weightNum) || weightNum < 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    try {
      let itemId: string;

      if (isEditing && jewelryId) {
        await updateMutation.mutateAsync({
          id: jewelryId,
          name: name.trim(),
          description: description.trim(),
          price: BigInt(Math.round(priceNum * 100)),
          available,
          material: material.trim(),
          weightGram: BigInt(weightNum),
          type: type.trim(),
        });
        itemId = jewelryId;
        toast.success("Jewelry item updated successfully");
      } else {
        itemId = await createMutation.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          price: BigInt(Math.round(priceNum * 100)),
          material: material.trim(),
          weightGram: BigInt(weightNum),
          type: type.trim(),
        });
        toast.success("Jewelry item created successfully");
      }

      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
          (percentage) => {
            setUploadProgress(percentage);
          },
        );

        await setImageMutation.mutateAsync({ jewelryId: itemId, blob });
        toast.success("Image uploaded successfully");
      }

      navigate({ to: "/admin/jewelry" });
    } catch (error: any) {
      toast.error(error.message || "Failed to save jewelry item");
    }
  };

  if (isLoading && isEditing) {
    return <LoadingState />;
  }

  const currentImageUrl = jewelry?.image?.getDirectURL();
  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    setImageMutation.isPending;

  return (
    <div className="container py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/admin/jewelry">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jewelry
        </Link>
      </Button>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-display text-4xl font-bold tracking-tight">
          {isEditing ? "Edit Jewelry Item" : "Add New Jewelry"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shimmer-border">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Silver Moon Necklace"
                  required
                  className="shimmer-border"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the jewelry piece..."
                  rows={4}
                  className="shimmer-border"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Input
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Necklace, Ring, Earrings..."
                    required
                    className="shimmer-border"
                  />
                </div>

                <div>
                  <Label htmlFor="material">Material *</Label>
                  <Input
                    id="material"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Sterling Silver, Gold..."
                    required
                    className="shimmer-border"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99.99"
                    required
                    className="shimmer-border"
                  />
                </div>

                <div>
                  <Label htmlFor="weight">Weight (grams) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    value={weightGram}
                    onChange={(e) => setWeightGram(e.target.value)}
                    placeholder="15"
                    required
                    className="shimmer-border"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="available">Available for Purchase</Label>
                  <p className="text-sm text-muted-foreground">
                    Show this item as in stock
                  </p>
                </div>
                <Switch
                  id="available"
                  checked={available}
                  onCheckedChange={setAvailable}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shimmer-border">
            <CardHeader>
              <CardTitle>Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentImageUrl && (
                <div className="aspect-square w-full max-w-xs overflow-hidden rounded-lg border shimmer-border">
                  <img
                    src={currentImageUrl}
                    alt="Current"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="image">
                  {currentImageUrl ? "Replace Image" : "Upload Image"}
                </Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="shimmer-border"
                  />
                </div>
                {imageFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>

              {setImageMutation.isPending && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading image...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Jewelry"
                  : "Create Jewelry"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/admin/jewelry">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
