import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetArtwork, useCreateArtwork, useUpdateArtwork, useSetArtworkImage } from '../../hooks/useQueries';
import LoadingState from '../../components/states/LoadingState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';

export default function AdminArtworkEditorPage() {
  const params = useParams({ strict: false });
  const artworkId = 'artworkId' in params ? params.artworkId : undefined;
  const navigate = useNavigate();
  const isEditMode = !!artworkId;

  const { data: artwork, isLoading: loadingArtwork } = useGetArtwork(artworkId || '');
  const createArtwork = useCreateArtwork();
  const updateArtwork = useUpdateArtwork();
  const setArtworkImage = useSetArtworkImage();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (artwork && isEditMode) {
      setTitle(artwork.title);
      setDescription(artwork.description);
      setPrice(Number(artwork.price).toString());
      setAvailable(artwork.available);
      if (artwork.image) {
        setImagePreview(artwork.image.getDirectURL());
      }
    }
  }, [artwork, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !price) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      let savedArtworkId = artworkId;

      if (isEditMode && artworkId) {
        await updateArtwork.mutateAsync({
          id: artworkId,
          title: title.trim(),
          description: description.trim(),
          price: BigInt(Math.round(priceNum * 100)),
          available,
        });
        toast.success('Artwork updated successfully');
      } else {
        savedArtworkId = await createArtwork.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          price: BigInt(Math.round(priceNum * 100)),
        });
        toast.success('Artwork created successfully');
      }

      if (imageFile && savedArtworkId) {
        setIsUploading(true);
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });

        await setArtworkImage.mutateAsync({
          artworkId: savedArtworkId,
          blob,
        });
        setIsUploading(false);
        toast.success('Image uploaded successfully');
      }

      navigate({ to: '/admin/artworks' });
    } catch (error: any) {
      setIsUploading(false);
      toast.error(error.message || 'Failed to save artwork');
    }
  };

  if (loadingArtwork && isEditMode) {
    return <LoadingState message="Loading artwork..." />;
  }

  return (
    <div className="container py-12">
      <Button variant="ghost" onClick={() => navigate({ to: '/admin/artworks' })} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Artworks
      </Button>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-display text-4xl font-bold tracking-tight">
          {isEditMode ? 'Edit Artwork' : 'Add New Artwork'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Artwork Details</CardTitle>
              <CardDescription>Enter the basic information about the artwork</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (USD) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="available">Available for Purchase</Label>
                  <p className="text-sm text-muted-foreground">Mark this artwork as available or sold</p>
                </div>
                <Switch id="available" checked={available} onCheckedChange={setAvailable} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Artwork Image</CardTitle>
              <CardDescription>Upload an image of the artwork</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview && (
                <div className="overflow-hidden rounded-lg border">
                  <img src={imagePreview} alt="Preview" className="h-64 w-full object-cover" />
                </div>
              )}
              <div>
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : 'Click to upload image'}
                      </p>
                    </div>
                  </div>
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createArtwork.isPending || updateArtwork.isPending || isUploading}
              className="flex-1"
            >
              {createArtwork.isPending || updateArtwork.isPending || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditMode ? (
                'Update Artwork'
              ) : (
                'Create Artwork'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: '/admin/artworks' })}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
